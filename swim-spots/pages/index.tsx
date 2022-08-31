import { Status, Wrapper } from "@googlemaps/react-wrapper";
import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

const GOOGLE_API_KEY: string = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";
// TODO get current location for center
const center = { lat: -34.397, lng: 150.644 };
const zoom = 4;

const ErrorComponent = <div>Something went wrong.</div>;

const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return <ClipLoader />;
    case Status.FAILURE:
      return ErrorComponent;
    case Status.SUCCESS:
      return <Map center={center} zoom={zoom} />;
  }
};

function Map({
  center,
  zoom,
}: {
  center: google.maps.LatLngLiteral;
  zoom: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(() => {
    if (ref.current && !map) {
      setMap(
        new window.google.maps.Map(ref.current, {
          center,
          zoom,
        })
      );
    }
  }, [center, zoom, map]);

  return <div ref={ref} id="map" />;
}

const MyApp = () => {
  return (
    <Wrapper apiKey={GOOGLE_API_KEY} render={render}>
      <h1>Swim Spots</h1>

      <Map center={center} zoom={zoom} />
    </Wrapper>
  );
};

const Home: NextPage = () => {
  return MyApp();
};

export default Home;
