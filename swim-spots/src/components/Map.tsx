import {
  Children,
  cloneElement,
  Dispatch,
  isValidElement,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
} from "react";

const ZOOM: number = 4;

// TODO: initialize to the user's current location
const CENTER: google.maps.LatLngLiteral = {
  lat: 0,
  lng: 0,
};

interface MapProps extends google.maps.MapOptions {
  map: google.maps.Map | undefined;
  setMap: Dispatch<SetStateAction<google.maps.Map | undefined>>;
  children?: ReactNode;
}
export default function Map({ map, setMap, children }: MapProps) {
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
