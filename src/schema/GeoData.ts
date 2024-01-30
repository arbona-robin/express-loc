import { z } from 'zod'

const geoDataSchema = z.object({
    latitude: z.number(),
    longitude: z.number(),
    key: z.string(),
    timestamp: z.union([z.string(), z.number()]),
    accuracy: z.number(),
})

export type GeoData = z.infer<typeof geoDataSchema>



const validGeoData = (input: any) => {
    let geoData: GeoData
    geoData = geoDataSchema.parse(input)
    return geoData
}


export default geoDataSchema

export { validGeoData }

