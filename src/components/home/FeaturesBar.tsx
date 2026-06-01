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
    <section className="border-y border-[#e4e4e4] bg-white">
      <div className="max-w-[1180px] mx-auto">

        <div className="grid grid-cols-3">

          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className={`
                  flex items-center justify-center gap-6
                  py-16
                  ${index !== 2 ? 'border-r border-[#e4e4e4]' : ''}
                `}
              >
                <Icon
                  size={48}
                  strokeWidth={1.7}
                  className="text-[#c17f4a]"
                />

                <div>
                  <h3 className="text-[16px] font-bold text-[#222] mb-1">
                    {feature.title}
                  </h3>

                  <p className="text-[14px] text-[#8a8a8a]">
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