import React, { useMemo } from "react";
import CanteenLayout from "../../components/CanteenLayout";
import ImageWithFallback from "../../components/ImageWithFallback";
import { useCanteenItems } from "../../store/canteenStore";
import { formatCurrency } from "../../utils/canteenFormUtils";
import "./canteen.css";

const StudentCanteen = () => {
  const items = useCanteenItems();

  const todaysMenu = useMemo(() => {
    return items
      .filter((item) => item.isToday && item.available)
      .sort((a, b) => {
        if (a.category === b.category) {
          return a.name.localeCompare(b.name);
        }
        return a.category.localeCompare(b.category);
      });
  }, [items]);

  return (
    <CanteenLayout activePath="/canteen">
      <section className="student-menu">
        <header className="canteen-admin__header">
          <div>
            <p className="eyebrow">Canteen</p>
            <h1>Today&apos;s Menu</h1>
            <p>Freshly prepared meals, snacks, and drinks curated for today.</p>
          </div>
        </header>

        {todaysMenu.length === 0 ? (
          <div className="empty-state">
            <p>Today&apos;s canteen menu will be posted soon 😋</p>
          </div>
        ) : (
          <div className="student-menu__grid">
            {todaysMenu.map((item) => (
              <article key={item.id} className="menu-card">
                <div className="menu-card__image">
                  <ImageWithFallback src={item.photoUrl} alt={`${item.name} photo`} />
                  {item.emoji && <span className="inventory-card__emoji">{item.emoji}</span>}
                </div>
                <div className="menu-card__body">
                  <span className="inventory-card__category">{item.category}</span>
                  <h3>{item.name}</h3>
                  <p className="menu-card__price">{formatCurrency(item.priceLkr)}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </CanteenLayout>
  );
};

export default StudentCanteen;
