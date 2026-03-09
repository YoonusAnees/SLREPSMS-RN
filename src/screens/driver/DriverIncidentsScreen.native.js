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
import { useDriverStore } from "../../store/driver.store";
import { http } from "../../api/http";

const SL_CITIES = [
  { name: "Colombo", lat: 6.9271, lng: 79.8612 },
  { name: "Kandy", lat: 7.2906, lng: 80.6337 },
  { name: "Galle", lat: 6.0535, lng: 80.221 },
  { name: "Jaffna", lat: 9.6615, lng: 80.0255 },
  { name: "Kurunegala", lat: 7.4863, lng: 80.3623 },
  { name: "Batticaloa", lat: 7.717, lng: 81.7 },
  { name: "Trincomalee", lat: 8.5874, lng: 81.2152 },
  { name: "Anuradhapura", lat: 8.3114, lng: 80.4037 },
  { name: "Matara", lat: 5.9485, lng: 80.5353 },
  { name: "Badulla", lat: 6.9934, lng: 81.055 },
];

const INCIDENT_TYPES = ["ACCIDENT", "BREAKDOWN", "MEDICAL", "FIRE", "OTHER"];
const SEVERITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
const SUSPECTED_VIOLATIONS = [
  { label: "None / Not sure", value: "" },
  { label: "Drunk Driving", value: "DRUNK_DRIVE" },
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

export default function DriverIncidentsScreen() {
  const incidents = useDriverStore((s) => s.incidents);
  const loadDashboardData = useDriverStore((s) => s.loadDashboardData);
  const createIncident = useDriverStore((s) => s.createIncident);

  const defaultCity = SL_CITIES[0];

  const [selectedCity, setSelectedCity] = useState(defaultCity.name);
  const [form, setForm] = useState({
    type: "ACCIDENT",
    severity: "LOW",
    lat: String(defaultCity.lat),
    lng: String(defaultCity.lng),
    locationText: defaultCity.name,
    description: "",
    plateNo: "",
    suspectedViolationCode: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [pickedImage, setPickedImage] = useState(null);
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

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    loadDashboardData().catch(() => {});
  }, [loadDashboardData]);

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

  async function handleCreate() {
    try {
      setSubmitting(true);

      const evidenceUrl = await uploadEvidenceIfNeeded();

      await createIncident({
        ...form,
        lat: Number(form.lat),
        lng: Number(form.lng),
        plateNo: form.plateNo.trim() || undefined,
        suspectedViolationCode: form.suspectedViolationCode || undefined,
        description: form.description.trim() || undefined,
        locationText: form.locationText.trim() || undefined,
        evidence: evidenceUrl || undefined,
      });

      Alert.alert("Success", "Incident created");
      await loadDashboardData();

      const nearest = getNearestCity(latitude, longitude);

      setForm({
        type: "ACCIDENT",
        severity: "LOW",
        lat: String(latitude),
        lng: String(longitude),
        locationText: form.locationText || nearest.name,
        description: "",
        plateNo: "",
        suspectedViolationCode: "",
      });
      setPickedImage(null);
    } catch (e) {
      Alert.alert(
        "Error",
        e?.response?.data?.message || "Failed to create incident"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen scroll={false}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <Text style={{ color: "#fff", fontSize: 22, fontWeight: "800" }}>
          My Incidents
        </Text>

        <Text style={{ color: "#94a3b8", marginBottom: 8 }}>
          Tap the map or use your current location.
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
                <Text
                  style={{ color: "#fff", fontWeight: active ? "700" : "500" }}
                >
                  {city.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <AppButton
          title={
            loadingLocation ? "Getting Location..." : "Use My Current Location"
          }
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

        <Text style={{ color: "#cbd5e1", fontWeight: "600", marginTop: 6 }}>
          Incident Type
        </Text>
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
            selectedValue={form.type}
            onValueChange={(v) => update("type", v)}
            dropdownIconColor="#fff"
            style={{ color: "#fff" }}
          >
            {INCIDENT_TYPES.map((item) => (
              <Picker.Item key={item} label={item} value={item} />
            ))}
          </Picker>
        </View>

        <Text style={{ color: "#cbd5e1", fontWeight: "600", marginTop: 6 }}>
          Severity
        </Text>
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
            selectedValue={form.severity}
            onValueChange={(v) => update("severity", v)}
            dropdownIconColor="#fff"
            style={{ color: "#fff" }}
          >
            {SEVERITIES.map((item) => (
              <Picker.Item key={item} label={item} value={item} />
            ))}
          </Picker>
        </View>

        <Input label="Latitude" value={form.lat} onChangeText={(v) => update("lat", v)} />
        <Input label="Longitude" value={form.lng} onChangeText={(v) => update("lng", v)} />
        <Input
          label="Location"
          value={form.locationText}
          onChangeText={(v) => update("locationText", v)}
        />
        <Input
          label="Description"
          value={form.description}
          onChangeText={(v) => update("description", v)}
          multiline
        />
        <Input
          label="Plate No"
          value={form.plateNo}
          onChangeText={(v) => update("plateNo", v)}
        />

        <Text style={{ color: "#cbd5e1", fontWeight: "600", marginTop: 6 }}>
          Suspected Violation Code
        </Text>
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
            dropdownIconColor="#fff"
            style={{ color: "#fff" }}
          >
            {SUSPECTED_VIOLATIONS.map((item) => (
              <Picker.Item
                key={item.value || "none"}
                label={item.label}
                value={item.value}
              />
            ))}
          </Picker>
        </View>

        <AppButton
          title={pickedImage ? "Change Photo" : "Pick Photo"}
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
          title={
            submitting
              ? "Creating..."
              : uploadingImage
              ? "Uploading Photo..."
              : "Create Incident"
          }
          onPress={handleCreate}
          loading={submitting || uploadingImage}
        />

        <View style={{ gap: 12 }}>
          {incidents.map((i) => (
            <View
              key={i.id}
              style={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                borderWidth: 1,
                padding: 14,
                borderRadius: 12,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>{i.type}</Text>
              <Text style={{ color: "#94a3b8" }}>{i.locationText || "-"}</Text>
              <Text style={{ color: "#fbbf24" }}>{i.status}</Text>
              {!!i.plateNo && (
                <Text style={{ color: "#cbd5e1" }}>Plate: {i.plateNo}</Text>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}