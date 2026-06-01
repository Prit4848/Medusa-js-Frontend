import Image from 'next/image';
import Link from 'next/link';

const blogs = [
  {
    id: 1,
    image: '/images/blog/image1.png',
    date: 'March 12, 2020',
    title: 'What is Shabby Chic?',
  },
  {
    id: 2,
    image: '/images/blog/image2.png',
    date: 'March 12, 2020',
    title: 'Best Examples of Maximalism',
  },
  {
    id: 3,
    image: '/images/blog/image3.png',
    date: 'March 12, 2020',
    title: 'What is Lorem Ipsum?',
  },
];

export default function BlogSection() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-[1180px] mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-[26px] font-bold text-[#222] mb-4">
            From Our Blogs
          </h2>

          <p className="max-w-[700px] mx-auto text-[14px] leading-[24px] text-[#8b8b8b]">
            Design your home interior story! Here are the latest trends,
            tips, and design tricks to help you out.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="text-center group"
            >
              <div className="relative h-[220px] overflow-hidden">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <p className="mt-4 text-[13px] text-[#9c9c9c]">
                {blog.date}
              </p>

              <h3 className="mt-2 text-[18px] font-bold text-[#222]">
                {blog.title}
              </h3>

              <Link
                href="/blog"
                className="mt-2 inline-block text-[14px] font-semibold text-[#c17f4a]"
              >
                Read More
              </Link>
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="mt-14 flex justify-center">
          <button className="w-[170px] h-[52px] border border-[#c17f4a] text-[#c17f4a] text-[14px] font-semibold uppercase tracking-[0.05em] transition-all duration-300 hover:bg-[#c17f4a] hover:text-white">
            VIEW MORE
          </button>
        </div>

      </div>
    </section>
  );
}