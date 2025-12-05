import type { UnitDefinition } from '../types/game';

interface ShopProps {
  items: Array<UnitDefinition | null>;
  gold: number;
  onBuy: (slot: number) => void;
  onReroll: () => void;
  onFreeRefresh: () => void;
}

const Shop = ({ items, gold, onBuy, onReroll, onFreeRefresh }: ShopProps) => (
  <section className="panel shop">
    <header>
      <div>
        <h2>Shop</h2>
        <p>Gold: {gold}</p>
      </div>
      <div className="shop__actions">
        <button type="button" onClick={onReroll}>
          Reroll (-2g)
        </button>
        <button type="button" onClick={onFreeRefresh}>
          Free refresh
        </button>
      </div>
    </header>
    <div className="shop__grid">
      {items.map((unit, index) =>
        unit ? (
          <button
            key={`${unit.id}-${index}`}
            type="button"
            className="shop-card"
            onClick={() => onBuy(index)}
          >
            <img src={unit.icon} alt={unit.name} loading="lazy" />
            <div>
              <strong>{unit.name}</strong>
              <small>{unit.traits.join(' · ')}</small>
            </div>
            <span className={`badge cost-${unit.cost}`}>{unit.cost}g</span>
          </button>
        ) : (
          <div key={`empty-${index}`} className="shop-card shop-card--empty">
            Sold
          </div>
        )
      )}
    </div>
  </section>
);

export default Shop;


