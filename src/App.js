import React, { useEffect, useState } from "react";
import { Button, Typography, Box } from "@mui/material";
import { AddCircle } from "@mui/icons-material";
import axios from "axios";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
function Category({
  name,
  index,
  parentIndex,
  level,
  addCategory,
  editCategory,
}) {
  const [checked, setChecked] = useState(false);

  const handleCheck = () => {
    setChecked(!checked);
    updateParentChecked(!checked);
  };

  const updateParentChecked = (value) => {
    let parent = parentIndex;
    while (parent) {
      parent.checked = value;
      parent = parent.parent;
    }
  };

  return (
    <>
      <span style={{ display: "flex", marginLeft: 50 }}>
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span style={{ marginBottom: ".5rem" }}>
              <input type="checkbox" checked={true} onChange={handleCheck} />
              <label className="mb-1">
                <h6>&nbsp;&nbsp;{name}&nbsp;&nbsp;</h6>
              </label>
              <button
                className="btn btn-outline-secondary m-0 p-0 px-1"
                variant="outlined"
                style={{ fontSize: "10px" }}
                onClick={() => addCategory(index, parentIndex)}
              >
                Add
              </button>
              &nbsp;
              <button
                className="btn btn-outline-secondary m-0 p-0 px-1"
                variant="outlined"
                style={{ fontSize: "10px" }}
                onClick={() => editCategory(index, parentIndex)}
              >
                Edit
              </button>
            </span>
          </div>
          {parentIndex.subcategories.map((subcategory, subIndex) => (
            <Category
              key={subcategory.id}
              name={subcategory.name}
              index={subIndex}
              parentIndex={subcategory}
              level={level + 1}
              addCategory={addCategory}
              editCategory={editCategory}
            />
          ))}
        </div>
      </span>
    </>
  );
}
function App() {
  const [categories, setCategories] = useState([]);
  console.log(categories);

  useEffect(() => {
    get_cat();
  }, []);

  const get_cat = async () => {
    const data = await axios.post(
      "api here",
      {
        configKey: "categorymenu",
      }
    );
    const catg = data.data;
    if (catg.length != 0) {
      setCategories(JSON.parse(data.data.data.configDefaultValue));
    }
  };
  let temp;
  const addCategory = (index, parentIndex) => {
    const name = prompt("Enter Category Name:");
    if (name === null) {
      return;
    }
    const id = Math.floor(Math.random() * 10000000);

    const updatedCategories = [...categories];
    console.log(parentIndex);
    if (!parentIndex) {
      console.log("1");
      setCategories([
        ...categories,
        { name, id, checked:true, subcategories: [] },
      ]);
    } else {
      console.log("2");
      parentIndex.subcategories = [
        ...parentIndex.subcategories,
        { name, id, checked: true, subcategories: [] },
      ];
      setCategories(updatedCategories);
    }
  };
  const editCategory = (index, parentIndex) => {
    try {
      const edit = parentIndex.name;
      const name = prompt("Enter Category Name:", edit);
      parentIndex.name = name;
      console.log(name);
      console.log(edit);
      const current_id = parentIndex.id;
      console.log(parentIndex.checked);
      setCategories([...categories]);
    } catch (error) {
      console.log(error);
    }
  };

  const showJSON = () => {
    const json = JSON.stringify(
      categories,
      (key, value) => {
        if (Array.isArray(value) && value.length === 0) {
          return undefined;
        }

        if (key === "subcategories") {
          console.log(categories);
          return value.map((subcategory) => ({
            ...subcategory,
            parent: categories.id,
          }));
        }
        return value;
      },
      2
    );
    console.log(json);
    console.log(categories);
    const final = categories;
    console.log(categories);
    setCategories(final);

    try {
      console.log(JSON.stringify(categories));
      const data = async () => {
        const ans = await axios.post(
          "api here",
          {
            configKey: "categorymenu",
            configValue: json,
            configDefaultValue: JSON.stringify(categories),
          }
        );
        console.log("data", ans.data);
      };
      data();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <h6 style={{ marginBottom: "1rem" }}>
        <h6>Categories</h6>
      </h6>
      <Button
        sx={{ mb: 3 }}
        variant="contained"
        size="small"
        onClick={() => addCategory(null, null)}
        startIcon={<AddCircle />}
      >
        Add Category
      </Button>
      {categories.map((category, index) => (
        <Category
          key={index}
          name={category.name}
          index={index}
          parentIndex={category}
          level={0}
          addCategory={addCategory}
          editCategory={editCategory}
        />
      ))}

      <br />
      <Box
        m={1}
        mt={10}
        display="flex"
        justifyContent="flex-end"
        alignItems="flex-end"
      >
        <Button variant="contained" size="small" onClick={showJSON}>
          Save
        </Button>
      </Box>
    </div>
  );
}

export default App;