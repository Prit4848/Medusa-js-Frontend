import Image from 'next/image';
import { FaInstagram } from 'react-icons/fa';

const images = [
  '/images/insta/image1.png',
  '/images/insta/image2.png',
  '/images/insta/image3.png',
  '/images/insta/image4.png',
  '/images/insta/image5.png',
  '/images/insta/image6.png',
];

export default function InstagramSection() {
  return (
    <section className="bg-white pt-16 pb-20">

      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-[32px] font-bold text-[#222]">
          Follow us on Instagram
        </h2>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">

        {images.map((image, index) => (
          <div
            key={index}
            className="relative aspect-square overflow-hidden group cursor-pointer"
          >
            <Image
              src={image}
              alt={`Instagram ${index + 1}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
        ))}

      </div>
    </section>
  );
}
