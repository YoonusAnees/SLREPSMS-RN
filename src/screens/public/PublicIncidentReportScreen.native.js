import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";

import Screen from "../../components/Screen";
import Input from "../../components/Input";
import AppButton from "../../components/AppButton";
import { usePublicStore } from "../../store/public.store";
import { http } from "../../api/http";

const SL_CITIES = [
    { name: "Colombo", lat: 6.9271, lng: 79.8612 },
    { name: "Negombo", lat: 7.2083, lng: 79.8358 },
    { name: "Kandy", lat: 7.2906, lng: 80.6337 },
    { name: "Kurunegala", lat: 7.4863, lng: 80.3623 },
    { name: "Anuradhapura", lat: 8.3114, lng: 80.4037 },
    { name: "Trincomalee", lat: 8.5874, lng: 81.2152 },
    { name: "Batticaloa", lat: 7.717, lng: 81.7 },
    { name: "Jaffna", lat: 9.6615, lng: 80.0255 },
    { name: "Galle", lat: 6.0535, lng: 80.221 },
    { name: "Matara", lat: 5.9485, lng: 80.5353 },
];

const INCIDENT_TYPES = ["ACCIDENT", "BREAKDOWN", "MEDICAL", "FIRE", "OTHER"];
const SEVERITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
const VIOLATIONS = [
    { label: "None / Not sure", value: "" },
    { label: "Drunken Driving", value: "DRUNK_DRIVE" },
    { label: "Reckless Driving", value: "RECKLESS_DRIVING" },
    { label: "No Helmet", value: "NO_HELMET" },
    { label: "Red Light Violation", value: "RED_LIGHT_VIOLATION" },
];

function distanceSq(aLat, aLng, bLat, bLng) {
    return (aLat - bLat) ** 2 + (aLng - bLng) ** 2;
}

function getNearestCity(lat, lng) {
    let nearest = SL_CITIES[0];
    let best = distanceSq(lat, lng, nearest.lat, nearest.lng);

    for (const city of SL_CITIES) {
        const d = distanceSq(lat, lng, city.lat, city.lng);
        if (d < best) {
            best = d;
            nearest = city;
        }
    }
    return nearest;
}

export default function PublicIncidentReportScreen() {
    const createPublicIncident = usePublicStore((s) => s.createPublicIncident);
    const reporting = usePublicStore((s) => s.loading.report);

    const defaultCity = SL_CITIES[0];

    const [selectedCity, setSelectedCity] = useState(defaultCity.name);
    const [form, setForm] = useState({
        type: "",
        severity: "",
        lat: String(defaultCity.lat),
        lng: String(defaultCity.lng),
        locationText: defaultCity.name,
        description: "",
        plateNo: "",
        suspectedViolationCode: "",
    });

    const [pickedImage, setPickedImage] = useState(null);
    const [vehiclePreview, setVehiclePreview] = useState(null);
    const [checkingVehicle, setCheckingVehicle] = useState(false);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const latitude = Number(form.lat) || defaultCity.lat;
    const longitude = Number(form.lng) || defaultCity.lng;

    const region = useMemo(
        () => ({
            latitude,
            longitude,
            latitudeDelta: 0.08,
            longitudeDelta: 0.08,
        }),
        [latitude, longitude]
    );

    const needsPlateField = useMemo(() => {
        const desc = String(form.description || "").toLowerCase();
        return (
            form.suspectedViolationCode === "DRUNK_DRIVE" ||
            form.suspectedViolationCode === "RECKLESS_DRIVING" ||
            desc.includes("drunk") ||
            desc.includes("drunken") ||
            desc.includes("drink drive") ||
            desc.includes("reckless")
        );
    }, [form.description, form.suspectedViolationCode]);

    const update = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    async function reverseGeocodeAndFill(lat, lng) {
        try {
            const results = await Location.reverseGeocodeAsync({
                latitude: lat,
                longitude: lng,
            });

            const nearestCity = getNearestCity(lat, lng);
            setSelectedCity(nearestCity.name);

            if (results && results.length > 0) {
                const r = results[0];
                const text = [
                    r.name,
                    r.street,
                    r.city || r.subregion || nearestCity.name,
                    r.region,
                ]
                    .filter(Boolean)
                    .join(", ");

                update("locationText", text || nearestCity.name);
            } else {
                update("locationText", nearestCity.name);
            }
        } catch {
            const nearestCity = getNearestCity(lat, lng);
            setSelectedCity(nearestCity.name);
            update("locationText", nearestCity.name);
        }
    }

    function handleCitySelect(city) {
        setSelectedCity(city.name);
        setForm((prev) => ({
            ...prev,
            lat: String(city.lat),
            lng: String(city.lng),
            locationText: city.name,
        }));
    }

    async function handleMapPress(e) {
        const { latitude: lat, longitude: lng } = e.nativeEvent.coordinate;
        update("lat", String(lat));
        update("lng", String(lng));
        await reverseGeocodeAndFill(lat, lng);
    }

    async function handleUseCurrentLocation() {
        try {
            setLoadingLocation(true);

            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permission needed", "Location permission was denied.");
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            const lat = location.coords.latitude;
            const lng = location.coords.longitude;

            update("lat", String(lat));
            update("lng", String(lng));
            await reverseGeocodeAndFill(lat, lng);
        } catch {
            Alert.alert("Location Error", "Failed to get current location");
        } finally {
            setLoadingLocation(false);
        }
    }

    async function handlePickPhoto() {
        try {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (permission.status !== "granted") {
                Alert.alert("Permission needed", "Photo library permission was denied.");
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                quality: 0.8,
            });

            if (!result.canceled && result.assets?.length) {
                setPickedImage(result.assets[0]);
            }
        } catch {
            Alert.alert("Error", "Failed to pick image");
        }
    }

    async function lookupVehicle(plateNo) {
        if (!plateNo?.trim()) {
            setVehiclePreview(null);
            return;
        }

        try {
            setCheckingVehicle(true);
            const res = await http.get(`/vehicles/by-plate/${encodeURIComponent(plateNo.trim())}`);
            setVehiclePreview(res.data);
        } catch {
            setVehiclePreview(null);
        } finally {
            setCheckingVehicle(false);
        }
    }

    async function uploadEvidenceIfNeeded() {
        if (!pickedImage?.uri) return null;

        try {
            setUploadingImage(true);

            const formData = new FormData();
            formData.append("file", {
                uri: pickedImage.uri,
                name: pickedImage.fileName || "incident.jpg",
                type: pickedImage.mimeType || "image/jpeg",
            });

            const { data } = await http.post("/incidents/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            return data?.url || null;
        } catch {
            Alert.alert("Upload Error", "Failed to upload photo");
            return null;
        } finally {
            setUploadingImage(false);
        }
    }

    async function handleSubmit() {
        try {
            if (!form.type || !form.severity) {
                Alert.alert("Validation", "Type and severity are required");
                return;
            }

            if (needsPlateField && !form.plateNo.trim()) {
                Alert.alert("Validation", "Please enter vehicle number plate");
                return;
            }

            const evidenceUrl = await uploadEvidenceIfNeeded();

            const result = await createPublicIncident({
                type: form.type,
                severity: form.severity,
                lat: Number(form.lat),
                lng: Number(form.lng),
                description: form.description.trim() || undefined,
                locationText: form.locationText.trim() || undefined,
                evidence: evidenceUrl || undefined,
                plateNo: form.plateNo.trim() || undefined,
                suspectedViolationCode: form.suspectedViolationCode || undefined,
            });

            if (result?.autoPenalty) {
                Alert.alert("Success", "Incident created and penalty auto-issued");
            } else if (result?.requiresOfficerReview) {
                Alert.alert("Success", "Incident reported. Officer review required");
            } else {
                Alert.alert("Success", "Incident reported successfully");
            }

            setForm({
                type: "",
                severity: "",
                lat: String(latitude),
                lng: String(longitude),
                locationText: form.locationText,
                description: "",
                plateNo: "",
                suspectedViolationCode: "",
            });
            setPickedImage(null);
            setVehiclePreview(null);
        } catch (e) {
            Alert.alert("Error", e?.response?.data?.message || "Failed to submit report");
        }
    }

    return (
        <Screen scroll={false}>
            <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
                <Text style={{ color: "#fff", fontSize: 28, fontWeight: "800" }}>
                    Report Road Incident
                </Text>
                <Text style={{ color: "#cbd5e1", lineHeight: 22 }}>
                    Help make roads safer — report accidents, breakdowns, hazards, suspected dangerous driving, or emergencies.
                </Text>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 8, paddingBottom: 8 }}
                >
                    {SL_CITIES.map((city) => {
                        const active = selectedCity === city.name;
                        return (
                            <TouchableOpacity
                                key={city.name}
                                onPress={() => handleCitySelect(city)}
                                style={{
                                    paddingHorizontal: 14,
                                    paddingVertical: 10,
                                    borderRadius: 999,
                                    backgroundColor: active ? "#4f46e5" : "#0f172a",
                                    borderWidth: 1,
                                    borderColor: active ? "#6366f1" : "#334155",
                                }}
                            >
                                <Text style={{ color: "#fff", fontWeight: active ? "700" : "500" }}>
                                    {city.name}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                <AppButton
                    title={loadingLocation ? "Getting Location..." : "Use My Current Location"}
                    onPress={handleUseCurrentLocation}
                    loading={loadingLocation}
                    variant="secondary"
                />

                <View
                    style={{
                        height: 280,
                        borderRadius: 14,
                        overflow: "hidden",
                        borderWidth: 1,
                        borderColor: "#334155",
                    }}
                >
                    <MapView
                        style={{ flex: 1 }}
                        initialRegion={region}
                        region={region}
                        onPress={handleMapPress}
                    >
                        <Marker
                            coordinate={{ latitude, longitude }}
                            draggable
                            onDragEnd={async (e) => {
                                const { latitude: lat, longitude: lng } = e.nativeEvent.coordinate;
                                update("lat", String(lat));
                                update("lng", String(lng));
                                await reverseGeocodeAndFill(lat, lng);
                            }}
                        />
                    </MapView>
                </View>

                <Text style={{ color: "#cbd5e1", fontWeight: "700" }}>Incident Type</Text>
                <View
                    style={{
                        backgroundColor: "#0f172a",
                        borderWidth: 1,
                        borderColor: "#334155",
                        borderRadius: 12,
                        overflow: "hidden",
                    }}
                >
                    <Picker selectedValue={form.type} onValueChange={(v) => update("type", v)} style={{ color: "#fff" }}>
                        <Picker.Item label="— Select type —" value="" />
                        {INCIDENT_TYPES.map((item) => (
                            <Picker.Item key={item} label={item} value={item} />
                        ))}
                    </Picker>
                </View>

                <Text style={{ color: "#cbd5e1", fontWeight: "700" }}>Severity Level</Text>
                <View
                    style={{
                        backgroundColor: "#0f172a",
                        borderWidth: 1,
                        borderColor: "#334155",
                        borderRadius: 12,
                        overflow: "hidden",
                    }}
                >
                    <Picker selectedValue={form.severity} onValueChange={(v) => update("severity", v)} style={{ color: "#fff" }}>
                        <Picker.Item label="— Select level —" value="" />
                        {SEVERITIES.map((item) => (
                            <Picker.Item key={item} label={item} value={item} />
                        ))}
                    </Picker>
                </View>

                <Text style={{ color: "#cbd5e1", fontWeight: "700" }}>Suspected Violation</Text>
                <View
                    style={{
                        backgroundColor: "#0f172a",
                        borderWidth: 1,
                        borderColor: "#334155",
                        borderRadius: 12,
                        overflow: "hidden",
                    }}
                >
                    <Picker
                        selectedValue={form.suspectedViolationCode}
                        onValueChange={(v) => update("suspectedViolationCode", v)}
                        style={{ color: "#fff" }}
                    >
                        {VIOLATIONS.map((item) => (
                            <Picker.Item key={item.value || "none"} label={item.label} value={item.value} />
                        ))}
                    </Picker>
                </View>

                {needsPlateField && (
                    <>
                        <Input
                            label="Vehicle Number Plate"
                            value={form.plateNo}
                            onChangeText={(v) => update("plateNo", v.toUpperCase())}
                        />

                        <AppButton
                            title={checkingVehicle ? "Checking Vehicle..." : "Check Vehicle"}
                            onPress={() => lookupVehicle(form.plateNo)}
                            loading={checkingVehicle}
                            variant="secondary"
                        />

                        {vehiclePreview ? (
                            <View
                                style={{
                                    backgroundColor: "#052915",
                                    borderWidth: 1,
                                    borderColor: "#14532d",
                                    borderRadius: 12,
                                    padding: 14,
                                    gap: 6,
                                }}
                            >
                                <Text style={{ color: "#86efac", fontWeight: "800" }}>
                                    Registered Vehicle Found
                                </Text>
                                <Text style={{ color: "#d1fae5" }}>Plate: {vehiclePreview.plateNo}</Text>
                                <Text style={{ color: "#d1fae5" }}>Type: {vehiclePreview.type}</Text>
                                <Text style={{ color: "#d1fae5" }}>Model: {vehiclePreview.model || "-"}</Text>
                                <Text style={{ color: "#d1fae5" }}>Owner: {vehiclePreview?.driver?.user?.name || "-"}</Text>
                                <Text style={{ color: "#d1fae5" }}>License No: {vehiclePreview?.driver?.licenseNo || "-"}</Text>
                                <Text style={{ color: "#d1fae5" }}>
                                    License Status: {vehiclePreview?.driver?.licenseStatus || "-"}
                                </Text>
                            </View>
                        ) : form.plateNo && !checkingVehicle ? (
                            <Text style={{ color: "#fbbf24" }}>
                                No registered vehicle found for this plate number.
                            </Text>
                        ) : null}
                    </>
                )}

                <Input label="Latitude" value={form.lat} onChangeText={(v) => update("lat", v)} />
                <Input label="Longitude" value={form.lng} onChangeText={(v) => update("lng", v)} />
                <Input
                    label="Location Description"
                    value={form.locationText}
                    onChangeText={(v) => update("locationText", v)}
                />
                <Input
                    label="Additional Details"
                    value={form.description}
                    onChangeText={(v) => update("description", v)}
                    multiline
                />

                <AppButton
                    title={pickedImage ? "Change Photo" : "Pick Photo / Evidence"}
                    onPress={handlePickPhoto}
                    variant="secondary"
                />

                {pickedImage?.uri ? (
                    <Image
                        source={{ uri: pickedImage.uri }}
                        style={{
                            width: "100%",
                            height: 180,
                            borderRadius: 12,
                            borderWidth: 1,
                            borderColor: "#334155",
                        }}
                        resizeMode="cover"
                    />
                ) : null}

                <AppButton
                    title={uploadingImage ? "Uploading..." : reporting ? "Submitting..." : "Submit Incident Report"}
                    onPress={handleSubmit}
                    loading={uploadingImage || reporting}
                />
            </ScrollView>
        </Screen>
    );
}