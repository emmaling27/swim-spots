import { FormEvent, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

interface AddressInputProps {
  map: google.maps.Map | undefined;
  marker: google.maps.Marker | undefined;
}

export default function AddressInput({ map, marker }: AddressInputProps) {
  const [address, setAddress] = useState("");
  const geocoder = new google.maps.Geocoder();
  const geocode = (showMarker: boolean) => {
    geocoder.geocode({ address: address }, function (results, status) {
      if (status == "OK") {
        if (results) {
          const firstResult = results[0].geometry.location;
          const center = {
            lat: firstResult.lat(),
            lng: firstResult.lng(),
          };
          if (map) {
            map.setCenter(center);
          }
          if (marker && showMarker) {
            marker.setPosition(center);
          }
        } else {
          throw Error("Results from geocoding request was null");
        }
      } else {
        console.error(
          `Request to geocoder failed with status ${status} and results ${results}`
        );
      }
    });
  };
  const codeAddress = (event: FormEvent) => {
    event.preventDefault();
    geocode(false);
  };

  const addMarker = async (event: FormEvent) => {
    event.preventDefault();
    geocode(true);
  };
  return (
    <div>
      <TextField
        id="outlined-name"
        label="Location"
        value={address}
        onChange={(event) => setAddress(event.target.value)}
      />
      <Button onClick={codeAddress} disabled={!address}>
        Search
      </Button>
      <Button onClick={addMarker} disabled={!address}>
        Add a spot
      </Button>
    </div>
  );
}
