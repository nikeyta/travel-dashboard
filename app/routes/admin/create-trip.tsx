import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";
import { Header } from "components";
import type { Route } from "./+types/create-trip";
import { useEffect, useState } from "react";

import { comboBoxItems, selectItems } from "~/constants";
import {
  Coordinate,
  LayerDirective,
  LayersDirective,
  MapsComponent,
} from "@syncfusion/ej2-react-maps";
import { world_map } from "~/constants/world_map";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { account } from "~/appwrite/client";
import { useNavigate } from "react-router";
import { cn } from "~/lib/utils";

export const loader = async () => {
  const response = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,flags,latlng,maps"
  );
  const data = await response.json();

  return data.map((country: any) => ({
    flag: country.flags.svg,
    name: country.name.common,
    coordinates: country.latlng,
    value: country.name.common,
    openStreetMap: country.maps?.openStreetMap,
  }));
};

const createTrip = ({ loaderData }: Route.ComponentProps) => {
  const navigate = useNavigate()
  const countries = loaderData as Country[];
  const [formData, setformData] = useState<TripFormData>({
    country: countries[0]?.name || "",
    travelStyle: "",
    interest: "",
    budget: "",
    duration: 0,
    groupType: "",
  });

  const [error, seterror] = useState<string | null>(null);
  const [loading, setloading] = useState(false);

  const countryData = countries.map((country) => ({
    text: country.name,
    value: country.value,
    flag: country.flag,
  }));

  const mapData = [
    {
      country: formData.country,
      color: "#EA32E",
      Coordinates:
        countries.find((c: Country) => c.name === formData.country)
          ?.coordinates || [],
    },
  ];

  //React wraps the native browser event (submit event in this case) in something called a SyntheticEvent. This is a cross-browser wrapper provided by React to normalize differences between browsers.
  const handleSubmit = async (e :React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(!formData.country || !formData.duration || !formData.budget || !formData.groupType || !formData.interest || !formData.travelStyle){
      setloading(false)
       seterror('Please provide values for all fields');
       return
    }
    if(formData.duration<1 || formData.duration>10){
      setloading(false)
      seterror('Duration must be between 1 to 10 days')
      return 
    }
    const user = await account.get();
    if(!user.$id){
      console.log('user not authenticated')
      setloading(false)
      return
    }

    try{
      const response = await fetch('/api/create-trip', {
        method : 'POST', 
        headers : {'content-type' : 'application/json'},
         body: JSON.stringify({
                   country: formData.country,
                   numberOfDays: formData.duration,
                   travelStyle: formData.travelStyle,
                   interests: formData.interest,
                   budget: formData.budget,
                   groupType: formData.groupType,
                   userId: user.$id
          })
      })
      const result: CreateTripResponse = await response.json()
      if(result?.id){
        navigate(`/trips/${result.id}`)
      }else console.error('failed to generate trip')

    }catch(e){
        console.log()
        setloading(false)
    }finally{
      setloading(false)
    }
  };
  const handleChange = async (
    key: keyof TripFormData,
    value: string | number
  ) => {
    setformData({ ...formData, [key]: value });
  };
  return (
    <main className="flex flex-col gap-10 pg-20 wrapper">
      <Header
        title="Add a New Trip"
        description="View and edit AI Generated travel plans"
      />
      <section className="mt-2.5 wrapper-md">
        <form className="trip-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="country">Country</label>
            {/* making a combo box component */}
            <ComboBoxComponent
              id="country"
              dataSource={countryData}
              fields={{ text: "text", value: "value" }}
              itemTemplate={(data: any) => (
                <div className="flex items-center gap-1">
                  <img
                    src={data.flag}
                    alt="flag"
                    className="w-5 h-4 rounded-sm aspect-square object-contain pl-1"
                  />
                  <span>{data.text}</span>
                </div>
              )}
              placeholder="Select a country"
              className="combo-box"
              change={(e: { value: string | undefined }) => {
                if (e.value) {
                  handleChange("country", e.value);
                }
              }}
              allowFiltering
              filtering={(e) => {
                const query = e.text.toLowerCase();
                const filtered = countryData.filter((country) =>
                  country.text.toLowerCase().includes(query)
                );
                e.updateData(filtered);
              }}
            />
          </div>
          <div>
            <label htmlFor="duration">Duration</label>
            <input
              id="duration"
              name="duration"
              type="number"
              placeholder="Enter number of days"
              className="form-input placeholder:text-gray-100"
              onChange={(e) => handleChange("duration", Number(e.target.value))}
            />
          </div>
          {selectItems.map((items) => (
            <div key={items}>
              <label htmlFor={items}>{items}</label>
              <ComboBoxComponent
                id={items}
                dataSource={comboBoxItems[items].map((item) => ({
                  text: item,
                  value: item,
                }))}
                fields={{ text: "text", value: "value" }}
                placeholder={`select ${items}`}
                change={(e: { value: string | undefined }) => {
                  if (e.value) {
                    handleChange(items, e.value);
                  }
                }}
                allowFiltering
                filtering={(e) => {
                  const query = e.text.toLowerCase();
                  const filtered = comboBoxItems[items]
                    .filter((item) => item.toLowerCase().includes(query))
                    .map((fitem) => ({
                      text: fitem,
                      value: fitem,
                    }));
                  e.updateData(filtered);
                }}
                className="combo-box"
              />
            </div>
          ))}
          <div>
            <label htmlFor="location">Location on the world map</label>
            <MapsComponent>
              <LayersDirective>
                <LayerDirective
                  shapeData={world_map}
                  shapeDataPath="country"
                  shapePropertyPath="name"
                  dataSource={mapData}
                  shapeSettings={{ colorValuePath: "color", fill: "#E5E5E5" }}
                />
              </LayersDirective>
            </MapsComponent>
          </div>

          {error && (
            <div className="error">
              <p>{error}</p>
            </div>
          )}
          <footer className="px-6 w-1/2 md:w-1/3 m-auto">
            <ButtonComponent
              type="submit"
              className="button-class !h-12 !w-full"
              disabled={loading}
            >
              <img
                src={`/assets/icons/${
                  loading ? "loader.svg" : "magic-star.svg"
                }`}
                alt="loading"
                className={cn("size-5", {'animate-spin': loading})}
              />
              <span className="p-16-semibold text-white">
                {loading ? "Generating..." : "Generate Trip"}
              </span>
            </ButtonComponent>
          </footer>
        </form>
      </section>
    </main>
  );
};

export default createTrip;
