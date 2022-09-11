import { Status, Wrapper } from "@googlemaps/react-wrapper";
import type { NextPage } from "next";
import {
  Children,
  cloneElement,
  Dispatch,
  FormEvent,
  isValidElement,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import ClipLoader from "react-spinners/ClipLoader";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const GOOGLE_API_KEY: string = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";
const ZOOM: number = 4;

// TODO: initialize to the user's current location
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

interface MapProps extends google.maps.MapOptions {
  map: google.maps.Map | undefined;
  setMap: Dispatch<SetStateAction<google.maps.Map | undefined>>;
  children?: ReactNode;
}
function Map({ map, setMap, children, ...options }: MapProps) {
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

  return (
    <>
      <div ref={ref} id="map" />
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          // set the map prop on the child component
          return cloneElement(child, { map });
        }
      })}
    </>
  );
}

interface MarkerProps extends google.maps.MarkerOptions {
  id: string;
  marker: google.maps.Marker | undefined;
  setMarker: Dispatch<SetStateAction<google.maps.Marker | undefined>>;
}
function Marker({ id, marker, setMarker, ...options }: MarkerProps) {
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

interface AddressInputProps {
  map: google.maps.Map | undefined;
  marker: google.maps.Marker | undefined;
}

function AddressInput({ map, marker }: AddressInputProps) {
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
