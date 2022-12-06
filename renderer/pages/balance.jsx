import React, { useRef, useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useStateContext } from "../lib/context";
import { v4 as uuidv4 } from "uuid";
import Nav from "../components/nav";

function Home() {
  const [incomePerCategorie, setIncomePerCategorie] = useState([]);
  const [expensePerCategorie, setExpensePerCategorie] = useState([]);

  const { expenseCategorie, incomeCategorie, balance, totalExpense, income, expense, totalIncome } = useStateContext();

  useEffect(() => {
    // set income per categorie
    let array = [];
    for (const inc of incomeCategorie) {
      let cat = { categorie: inc, total: 0 };
      array.push(cat);
    }

    let arraySec = [];
    for (const inc of array) {
      let total = 0;
      for (const incomePrice of income) {
        if (incomePrice.categorie === inc.categorie) {
          if (incomePrice.prix != "") {
            total += parseFloat(incomePrice.prix);
          }
        }
      }
      let newCat = { categorie: inc.categorie, total: total.toFixed(2) };
      arraySec.push(newCat);
    }
    setIncomePerCategorie([...arraySec]);

    // set expense per categorie
    let arrayExp = [];
    for (const exp of expenseCategorie) {
      let cat = { categorie: exp, total: 0 };
      arrayExp.push(cat);
    }

    let arrayExpSec = [];
    for (const exp of arrayExp) {
      let total = 0;
      for (const expensePrice of expense) {
        if (expensePrice.categorie === exp.categorie) {
          console.log(expensePrice.prix);
          if (expensePrice.prix != "") {
            total += parseFloat(expensePrice.prix);
          }
        }
      }
      let newCatExp = { categorie: exp.categorie, total: total.toFixed(2) };
      arrayExpSec.push(newCatExp);
    }
    setExpensePerCategorie([...arrayExpSec]);
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>Home - Pay less</title>
      </Head>
      <div className="grid grid-col-1 text-2xl w-full ">
        <Nav />
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 crediteur">
          <h1 className="text-6xl font-normal leading-normal mt-0 mb-2 text-gray-800">Résumé</h1>
        </div>
        <div className="flex-wrap flex flex-col justify-center bg-white shadow-md rounded px-8 pt-6 pb-8">
          <h2 style={{ fontWeight: "bold", marginBottom: "20px" }}>Entrées</h2>
          {incomePerCategorie.map((item, index) => {
            if (item.total != 0) {
              return (
                <p>
                  {item.categorie} : {item.total}
                </p>
              );
            }
            return;
          })}
          <div style={{ fontWeight: "bold" }}>total entrées : {totalIncome}</div>
          <hr style={{ marginBottom: "30px", marginTop: "30px" }}></hr>

          <h2 style={{ fontWeight: "bold", marginBottom: "20px" }}>Sorties</h2>
          {expensePerCategorie.map((item, index) => {
            if (item.total != 0) {
              return (
                <p>
                  {item.categorie} : {item.total}
                </p>
              );
            }
            return;
          })}
          <div style={{ fontWeight: "bold" }}>total sorties : {totalExpense}</div>
          <hr style={{ marginBottom: "30px", marginTop: "30px" }}></hr>

          <div style={{ fontWeight: "bold" }}>Bénéfice : {(totalIncome - totalExpense).toFixed(2)}</div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Home;
