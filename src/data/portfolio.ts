import couple from '../assets/aaa.jpg'
import winter from '../assets/ccc.png'

export type Photo = {
    src: string
    alt: string
    caption: string
}

const picsum = (id: number, w = 900, h = 1200) =>
    `https://picsum.photos/id/${id}/${w}/${h}`

export const photos: Photo[] = [
    { src: couple, alt: 'Para młoda w świetle zachodzącego słońca', caption: 'Ania & Marek — plener' },
    { src: winter, alt: 'Para w zimowym lesie z lotu ptaka', caption: 'Kasia & Piotr — zima' },
    { src: picsum(1015), alt: 'Sesja nad rzeką', caption: 'Nad rzeką — sesja narzeczeńska' },
    { src: picsum(1018), alt: 'Górski krajobraz o świcie', caption: 'Świt w górach' },
    { src: picsum(1019), alt: 'Mgła nad lasem', caption: 'Poranna mgła' },
    { src: picsum(1039), alt: 'Wodospad w dolinie', caption: 'Dolina — plener' },
    { src: picsum(1043), alt: 'Miejski detal', caption: 'Miasto po zmroku' },
    { src: picsum(1050), alt: 'Nadmorski klif', caption: 'Wybrzeże' },
    { src: picsum(1062), alt: 'Jezioro o zmierzchu', caption: 'Zmierzch nad jeziorem' },
]

/** First three entries — used as the Home page work preview. */
export const featured: Photo[] = photos.slice(0, 3)

/** Start page slideshow — landscape crops so they fill the viewport. */
export const slides: Photo[] = photos.map((photo) => ({
    ...photo,
    src: photo.src.replace(/\/900\/1200$/, '/1920/1200'),
}))
