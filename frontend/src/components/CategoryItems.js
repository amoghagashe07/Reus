import React, { useEffect, useState } from 'react';
import './styles/CategoryItems.css';
import ItemList from './ItemList';
import CategoryFilter from './CategoryFilter';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import AddItem from './AddItem';
import { storeItemsAction } from '../actions';

function CategoryItem() {
  const { userId } = useSelector((state) => state.auth);
  const { inventory } = useSelector((state) => state.items);

  const dispatch = useDispatch();

  const [categories, setCategories] = useState([
    { title: 'Vegetables', id: 0 },
    { title: 'Fruits', id: 1 },
    { title: 'Protein', id: 2 },
    { title: 'Dairy', id: 3 },
    { title: 'Oils', id: 4 },
    { title: 'Beverages', id: 5 },
    { title: 'Grains', id: 6 },
    { title: 'Other', id: 7 }
  ]);
  const [items, setItems] = useState(inventory);
  const [byProducts, setByProducts] = useState([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState(
    categories[0].id
  );

  const onSelectCategory = (id) => {
    setSelectedCategoryId(id);
  };

  const selectedCategory = categories.filter(
    (category) => category.id === selectedCategoryId
  )[0];

  const getByProducts = async () => {
    const response = await fetch(`/api/byproduct`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (!data.error === '') return data.error;
    else {
      setByProducts(data.items);
    }
  };

  const getItems = async () => {
    const response = await fetch(`/api/items`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        UserId: userId
      }
    });
    const data = await response.json();
    data.items.sort(function(a, b) {
      let keyA = new Date(a.expiryDate);
      let keyB = new Date(b.expiryDate);
      // Compare the 2 dates
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });
    if (!data.error === '') return data.error;
    else {
      setItems(data.items);
      dispatch(storeItemsAction(data.items));
    }
  };

  useEffect(() => {
    if (!inventory.length > 0) {
      getItems();
    }
    getByProducts();
  }, []);

  return (
    <div className="categoryFilter">
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />
      <ItemList
        items={items}
        setItems={setItems}
        byProducts={byProducts}
        selectedCategory={selectedCategory}
      />
    </div>
  );
}
export default CategoryItem;
