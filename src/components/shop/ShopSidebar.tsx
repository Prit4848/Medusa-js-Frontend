'use client';

import { Range } from 'react-range';
import { ProductCategory, ProductCollection } from '@/middleware/types/commerce.types';
import { ShopFilters } from './ShopPage';

interface ShopSidebarProps {
  filters: ShopFilters;
  onFiltersChange: (filters: ShopFilters) => void;
  categories: ProductCategory[];
  collections: ProductCollection[];
  priceMaxLimit: number;
}

const AVAILABILITY = ['On Stock', 'Out of Stock'];

export default function ShopSidebar({
  filters,
  onFiltersChange,
  categories,
  collections,
  priceMaxLimit,
}: ShopSidebarProps) {
  const toggle = (arr: string[], item: string): string[] =>
    arr.includes(item)
      ? arr.filter((i) => i !== item)
      : [...arr, item];

  const handleCategory = (name: string) =>
    onFiltersChange({
      ...filters,
      categories: toggle(filters.categories, name),
    });

  const handleBrand = (title: string) =>
    onFiltersChange({
      ...filters,
      brands: toggle(filters.brands, title),
    });

  const handleAvailability = (avail: string) =>
    onFiltersChange({
      ...filters,
      availability: toggle(filters.availability, avail),
    });

  return (
    <aside style={styles.sidebar}>
      {categories.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Categories</h3>

          {categories.map((cat) => (
            <label key={cat.id} style={styles.checkItem}>
              <input
                type="checkbox"
                checked={filters.categories.includes(cat.name)}
                onChange={() => handleCategory(cat.name)}
                style={styles.checkbox}
              />

              <span style={styles.checkLabel}>
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      )}

      {/* PRICE */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Price</h3>

        <p style={styles.priceLabel}>
          Price Range: ${filters.priceMin} - ${filters.priceMax}
        </p>

        <Range
          step={1}
          min={0}
          max={priceMaxLimit}
          values={[filters.priceMin, filters.priceMax]}
          onChange={([min, max]) =>
            onFiltersChange({
              ...filters,
              priceMin: min,
              priceMax: max,
            })
          }
          renderTrack={({ props, children }) => {
            const { key, ...rest } = props as any;

            return (
              <div
                key={key}
                {...rest}
                style={{
                  ...rest.style,
                  height: '4px',
                  width: '100%',
                  background: '#ececec',
                  borderRadius: '999px',
                }}
              >
                {children}
              </div>
            );
          }}
          renderThumb={({ props }) => {
            const { key, ...rest } = props;

            return (
              <div
                key={key}
                {...rest}
                style={{
                  ...rest.style,
                  height: '14px',
                  width: '14px',
                  borderRadius: '50%',
                  background: '#c97a4a',
                  cursor: 'pointer',
                }}
              />
            );
          }}
        />

        <div style={styles.priceMinMax}>
          <span>{filters.priceMin} $</span>
          <span>{filters.priceMax} $</span>
        </div>
      </div>

      {collections.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Brands</h3>

          {collections.map((col) => (
            <label key={col.id} style={styles.checkItem}>
              <input
                type="checkbox"
                checked={filters.brands.includes(col.title)}
                onChange={() => handleBrand(col.title)}
                style={styles.checkbox}
              />

              <span style={styles.checkLabel}>
                {col.title}
              </span>
            </label>
          ))}
        </div>
      )}

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Availability</h3>

        {AVAILABILITY.map((avail) => (
          <label key={avail} style={styles.checkItem}>
            <input
              type="checkbox"
              checked={filters.availability.includes(avail)}
              onChange={() => handleAvailability(avail)}
              style={styles.checkbox}
            />

            <span style={styles.checkLabel}>
              {avail}
            </span>
          </label>
        ))}
      </div>
    </aside>
  );
}

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    width: 310,
    minWidth: 310,
    padding: '42px 32px',
    background: '#fafafa',
    borderRight: '1px solid #ececec',
    flexShrink: 0,
  },

  section: {
    marginBottom: 48,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: '#222',
    marginBottom: 26,
  },

  checkItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18,
    cursor: 'pointer',
  },

  checkbox: {
    width: 20,
    height: 20,
    cursor: 'pointer',
  },

  checkLabel: {
    fontSize: 16,
    color: '#444',
  },

  priceLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 18,
  },

  priceMinMax: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 16,
    color: '#888',
    fontSize: 14,
  },
};