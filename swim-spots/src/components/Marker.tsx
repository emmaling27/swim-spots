import { Dispatch, SetStateAction, useEffect } from "react";

interface MarkerProps extends google.maps.MarkerOptions {
  id: string;
  marker: google.maps.Marker | undefined;
  setMarker: Dispatch<SetStateAction<google.maps.Marker | undefined>>;
}
export default function Marker({
  id,
  marker,
  setMarker,
  ...options
}: MarkerProps) {
  useEffect(() => {
    if (!marker) {
      setMarker(new google.maps.Marker());
    }

    // remove marker from map on unmount
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker, setMarker]);

  useEffect(() => {
    if (marker) {
      marker.setOptions(options);
    }
  }, [marker, options]);

  return null;
}
