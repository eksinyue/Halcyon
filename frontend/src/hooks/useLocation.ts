import { useEffect, useState } from "react";
// @ts-ignore
import CRG from "country-reverse-geocoding";

const crg = CRG.country_reverse_geocoding();

const useLocation = () => {
  const [location, setLocation] = useState({
    isReady: false,
    lat: 0,
    lng: 0,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          isReady: true,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  }, []);

  return location;
};

export const useCountry = () => {
  const location = useLocation();
  const country = crg.get_country(location.lat, location.lng);

  return country ? country.name : "";
};

export default useLocation;
