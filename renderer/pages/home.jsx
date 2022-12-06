import React, { useRef, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useStateContext } from "../lib/context";
import { v4 as uuidv4 } from "uuid";
import Nav from "../components/nav";
import { TiDelete } from "react-icons/ti";

function Home() {
  const incCatRef = useRef();
  const expCatRef = useRef();

  const { setIncomeCategorie, incomeCategorie, expenseCategorie, setExpenseCategorie } = useStateContext();

  const deleteIncCat = (index) => {
    let allIncCat = [...incomeCategorie];
    allIncCat.splice(index, 1);

    setIncomeCategorie(allIncCat);
  };
  const addIncCat = (event) => {
    if (event.key === "Enter") {
      console.log("do validate");
      let data = [...incomeCategorie];
      let thisValue = event.target.value;
      data.push(thisValue);
      setIncomeCategorie(data);
      incCatRef.current.value = "";
    }
  };

  const deleteExpCat = (index) => {
    let allIncCat = [...expenseCategorie];
    allIncCat.splice(index, 1);

    setExpenseCategorie(allIncCat);
  };
  const addExpCat = (event) => {
    if (event.key === "Enter") {
      console.log("do validate");
      let data = [...expenseCategorie];
      let thisValue = event.target.value;
      data.push(thisValue);
      setExpenseCategorie(data);
      expCatRef.current.value = "";
    }
  };

  return (
    <React.Fragment>
      <Head>
        <title>Home - Pay less</title>
      </Head>
      <div className="grid grid-col-1 text-2xl w-full ">
        <Nav />
        <form onSubmit={(e) => e.preventDefault()} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mt-20">
          <label className="block text-gray-700 text-ssm font-bold mb-2" htmlFor="cat-entree">
            Catégories d'entrées
          </label>
          <input
            ref={incCatRef}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-500"
            type="text"
            name="cat-entree"
            maxLength="70"
            onKeyDown={addIncCat}
          />
          {incomeCategorie.map((input, index) => {
            return (
              <div className="inline-block  py-2 px-3" key={index}>
                <div className="flex align-center justify-center bg-blue-500  text-white font-bold py-2 px-4 rounded focus:outline-none focus:border-gray-500">
                  <div>{input}</div>
                  <div
                    className="pl-3 delete-tag"
                    onClick={(e) => {
                      e.preventDefault();
                      deleteIncCat(index);
                    }}
                  >
                    <TiDelete />
                  </div>
                </div>
              </div>
            );
          })}

          <label className="block text-gray-700 text-ssm font-bold mb-2" htmlFor="cat-entree">
            Catégories de sorties
          </label>
          <input
            ref={expCatRef}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-500"
            type="text"
            name="cat-entree"
            maxLength="70"
            onKeyDown={addExpCat}
          />
          {expenseCategorie.map((input, index) => {
            return (
              <div className="inline-block  py-2 px-3" key={index}>
                <div className="flex align-center justify-center bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:border-gray-500">
                  <div>{input}</div>
                  <div
                    className="pl-3 delete-tag"
                    onClick={(e) => {
                      e.preventDefault();
                      deleteExpCat(index);
                    }}
                  >
                    <TiDelete />
                  </div>
                </div>
              </div>
            );
          })}
        </form>
      </div>
    </React.Fragment>
  );
}

export default Home;
