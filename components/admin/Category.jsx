import { useEffect, useState } from "react";
import Input from "../form/Input";
import Title from "../ui/Title";
import { toast } from "react-toastify";
import axios from "axios";

const Category = () => {
  const [inputText, setInputText] = useState("");
  const [categories, setCategories] = useState([]);

  // Fetch categories from backend
  const getCategories = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/categories`
      );
      setCategories(res?.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  // Create new category
  const handleCreate = async () => {
    if (!inputText.trim()) {
      toast.error("Category title cannot be empty");
      return;
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
        title: inputText.trim(),
      });

      toast.success("Category Created", {
        position: "bottom-left",
      });

      setInputText("");
      await getCategories(); // Re-fetch categories to ensure persistence
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category");
    }
  };

  // Delete category
  const handleDelete = async (e, id) => {
    e.preventDefault();
    try {
      if (confirm("Are you sure you want to delete this category?")) {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`
        );
        toast.warning("Category Deleted", {
          position: "bottom-left",
          theme: "colored",
        });
        await getCategories(); // Refresh list
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="lg:p-8 flex-1 lg:mt-0 mt-5">
      <Title addClass="text-[40px]">Category</Title>
      <div className="mt-5">
        <div className="flex gap-4 flex-1 items-center">
          <Input
            placeholder="Add a new Category..."
            onChange={(e) => setInputText(e.target.value)}
            value={inputText}
          />
          <button className="btn-primary" onClick={handleCreate}>
            Add
          </button>
        </div>

        <div className="mt-10 max-h-[40rem] overflow-auto p-4 flex flex-col justify-center">
          {categories.length > 0 ? (
            categories.map((category) =>
              category?._id && category?.title ? (
                <div
                  key={category._id}
                  className="flex justify-between mt-4 border p-3 items-center border-r-4 border-b-8 border-primary rounded-lg hover:border-secondary transition-all"
                >
                  <b className="sm:text-xl text-md">{category.title}</b>
                  <button
                    className="btn-primary !bg-danger text-sm sm:text-base"
                    onClick={(e) => handleDelete(e, category._id)}
                  >
                    Delete
                  </button>
                </div>
              ) : null
            )
          ) : (
            <p className="text-gray-500 text-center mt-6">No categories found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Category;
