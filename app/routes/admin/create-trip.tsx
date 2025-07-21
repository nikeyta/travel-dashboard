import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";
import { Header } from "components";
import type { Route } from "./+types/create-trip";
import { useEffect } from "react";
import { useLoaderData } from "react-router";

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

const handleChange = async (
  key: keyof TripFormData,
  value: string | number
) => {};

const createTrip = ({ loaderData }: Route.ComponentProps) => {
  const countries = useLoaderData() as Country[];
  const countryData = countries.map((country) => ({
    text: country.name,
    value: country.value,
    flag: country.flag,
  }));
  const handleSubmit = async () => {};
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
              filtering= {e=>{
                const query = e.text.toLowerCase()
                const filtered= countryData.filter((country)=>(
                    country.text.toLowerCase().includes(query)
                ))
                 e.updateData(filtered)
              }}

            />
          </div>
          <div>
            <label htmlFor="duration">Duration</label>
            <input 
            id='duration'
            name="duration"  
            type='number'
            
            placeholder="Enter number of days"
            className="form-input placeholder:text-gray-100"
            onChange={(e)=>handleChange('duration',Number(e.target.value))}
            />
          </div>
        </form>
      </section>
    </main>
  );
};

export default createTrip;
