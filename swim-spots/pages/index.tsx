import { Status, Wrapper } from "@googlemaps/react-wrapper";
import type { NextPage } from "next";
import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import AddressInput from "../src/components/AddressInput";

import Map from "../src/components/Map";
import Marker from "../src/components/Marker";

const GOOGLE_API_KEY: string = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";

const ErrorComponent = <div>Something went wrong.</div>;

const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return <ClipLoader />;
    case Status.FAILURE:
      return ErrorComponent;
    case Status.SUCCESS:
      return <h3>success</h3>;
  }
};

const MyApp = () => {
  const [map, setMap] = useState<google.maps.Map>();
  const [marker, setMarker] = useState<google.maps.Marker>();
  return (
    <Wrapper apiKey={GOOGLE_API_KEY} render={render}>
      <h1>Swim Spots</h1>
      {!!map && <AddressInput map={map} marker={marker} />}
      <Map map={map} setMap={setMap}>
        <Marker id="marker" marker={marker} setMarker={setMarker} />
      </Map>
    </Wrapper>
  );
};

const Home: NextPage = () => {
  return MyApp();
};

export default Home;
