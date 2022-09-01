import { Status, Wrapper } from "@googlemaps/react-wrapper";
import type { NextPage } from "next";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import ClipLoader from "react-spinners/ClipLoader";

const GOOGLE_API_KEY: string = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";
const ZOOM: number = 4;
const CENTER: google.maps.LatLngLiteral = {
  lat: 0,
  lng: 0,
};

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

function Map({
  map,
  setMap,
}: {
  map: google.maps.Map | undefined;
  setMap: Dispatch<SetStateAction<google.maps.Map | undefined>>;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && !map) {
      setMap(
        new window.google.maps.Map(ref.current, {
          center: CENTER,
          zoom: ZOOM,
        })
      );
    }
  }, [map, setMap, ref]);

  return <div ref={ref} id="map" />;
}

interface AddressInputProps {
  map: google.maps.Map | undefined;
}

function AddressInput({ map }: AddressInputProps) {
  const [address, setAddress] = useState("");
  const geocoder = new google.maps.Geocoder();
  const codeAddress = (event: FormEvent) => {
    event.preventDefault();
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
  return (
    <form onSubmit={codeAddress} className="d-flex justify-content-center">
      <input
        value={address}
        onChange={(event) => setAddress(event.target.value)}
        className="form-control w-50"
        placeholder="Location..."
      />
      <input
        type="submit"
        value="Search"
        className="ms-2 btn btn-primary"
        disabled={!address}
      />
    </form>
  );
}

const MyApp = () => {
  const [map, setMap] = useState<google.maps.Map>();
  return (
    <Wrapper apiKey={GOOGLE_API_KEY} render={render}>
      <h1>Swim Spots</h1>
      {!!map && <AddressInput map={map} />}
      <Map map={map} setMap={setMap} />
    </Wrapper>
  );
};

const Home: NextPage = () => {
  return MyApp();
};

export default Home;
