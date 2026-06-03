import { Truck, Headphones, RefreshCcw } from 'lucide-react';

export default function FeaturesBar() {
  const features = [
    {
      icon: Truck,
      title: 'FREE SHIPPING',
      subtitle: 'On all orders of $150',
    },
    {
      icon: Headphones,
      title: '24/7 SUPPORT',
      subtitle: 'Get help when you need it',
    },
    {
      icon: RefreshCcw,
      title: '100% MONEY BACK',
      subtitle: '30 day money back guarantee',
    },
  ];

  return (
    <section className="border-y border-[#e4e4e4] bg-white mt-10">
      <div className="max-w-[1180px] mx-auto px-6 lg:px-0">

        <div className="grid grid-cols-1 md:grid-cols-3">

          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className={`
                  flex items-center justify-center gap-6
                  py-10 lg:py-16
                  border-b md:border-b-0 md:border-r border-[#e4e4e4] last:border-b-0 md:last:border-r-0
                `}
              >
                <Icon
                  strokeWidth={1.7}
                  className="text-[#c17f4a] w-10 h-10 lg:w-12 lg:h-12"
                />

                <div>
                  <h3 className="text-[14px] lg:text-[16px] font-bold text-[#222] mb-1">
                    {feature.title}
                  </h3>

                  <p className="text-[13px] lg:text-[14px] text-[#8a8a8a]">
                    {feature.subtitle}
                  </p>
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
  }