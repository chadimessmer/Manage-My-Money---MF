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

  const { setIncomeCategorie, incomeCategorie, expenseCategorie, setExpenseCategorie, infos, setInfos, setTransaction } = useStateContext();

  const deleteIncCat = (index) => {
    let allIncCat = [...incomeCategorie];
    allIncCat.splice(index, 1);

    setIncomeCategorie(allIncCat);
  };
  const addIncCat = (event) => {
    if (event.key === "Enter") {
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
      let data = [...expenseCategorie];
      let thisValue = event.target.value;
      data.push(thisValue);
      setExpenseCategorie(data);
      expCatRef.current.value = "";
    }
  };

  const changeInfo = (index, value) => {
    let newInfo = { ...infos };
    console.log(newInfo);
    newInfo[index] = value;
    setInfos(newInfo);
  };

  function onReaderLoad(event) {
    var obj = JSON.parse(event.target.result);
    console.log(obj);
    setInfos(obj[0]);
    setIncomeCategorie(obj[1]);
    setExpenseCategorie(obj[2]);
    setTransaction(obj[3]);
  }

  return (
    <React.Fragment>
      <Head>
        <title>Home - Pay less</title>
      </Head>
      <div className="grid grid-col-1 text-2xl w-full ">
        <Nav />
        <form onSubmit={(e) => e.preventDefault()} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mt-20">
          <label className="block text-gray-700 text-ssm font-bold mb-2" htmlFor="import">
            Ouvrir session
          </label>
          <input
            className="form-control block  px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            onChange={(e) => {
              if (e.target.files[0]) {
                var reader = new FileReader();
                reader.onload = onReaderLoad;
                reader.readAsText(e.target.files[0]);
              }
            }}
            type="file"
            accept="application/JSON"
          />
          <hr style={{ marginBottom: "30px", marginTop: "30px" }}></hr>
          <label className="block text-gray-700 text-ssm font-bold mb-2" htmlFor="cat-entree">
            Nom
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-500"
            type="text"
            name="cat-entree"
            maxLength="70"
            value={infos.name}
            onChange={(event) => changeInfo("name", event.target.value)}
          />
          <label className="block text-gray-700 text-ssm font-bold mb-2" htmlFor="cat-entree">
            Période fiscale
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-500"
            type="text"
            name="cat-entree"
            maxLength="70"
            value={infos.year}
            onChange={(event) => changeInfo("year", event.target.value)}
          />
          <label className="block text-gray-700 text-ssm font-bold mb-2" htmlFor="cat-entree">
            Numéro de référence fiscale
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-500"
            type="text"
            name="cat-entree"
            maxLength="70"
            value={infos.ref}
            onChange={(event) => changeInfo("ref", event.target.value)}
          />
          <hr style={{ marginBottom: "30px", marginTop: "30px" }}></hr>

          <label className="block text-gray-700 text-ssm font-bold mb-2" htmlFor="cat-entree">
            Comptes d'entrées
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
            if (input != "-") {
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
            }
          })}

          <label className="block text-gray-700 text-ssm font-bold mb-2" htmlFor="cat-entree">
            Comptes de sorties
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
            if (input != "-") {
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
            }
          })}
        </form>
      </div>
    </React.Fragment>
  );
}

export default Home;
