import React, { useRef, useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useStateContext } from "../lib/context";
import { v4 as uuidv4 } from "uuid";
import Nav from "../components/nav";
import * as XLSX from "xlsx/xlsx.mjs";
import { PDFDownloadLink } from "@react-pdf/renderer";
import MyDocument from "../components/pdfResult";

function Home() {
  const [incomePerCategorie, setIncomePerCategorie] = useState([]);
  const [expensePerCategorie, setExpensePerCategorie] = useState([]);
  const [clicked, setClicked] = useState(false);

  const { expenseCategorie, incomeCategorie, balance, totalExpense, income, expense, totalIncome, infos } = useStateContext();

  useEffect(() => {
    console.log(income);
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

  const handleExportXlsx = () => {
    let wb = XLSX.utils.book_new();

    //Feuille bilan
    let tab = [
      {
        val1: "Entrées",
        val2: "CHF",
      },
    ];

    let blank = {
      val1: "",
      val2: "",
    };
    tab.push(blank);
    for (const item of incomePerCategorie) {
      if (item.total != 0) {
        let newVal = {
          val1: item.categorie,
          val2: item.total,
        };
        tab.push(newVal);
      }
    }
    let totalIncWs = {
      val1: "Total entrées",
      val2: totalIncome,
    };
    tab.push(totalIncWs);

    tab.push(blank);

    let headExp = {
      val1: "Sorties",
      val2: "",
    };
    tab.push(headExp);

    for (const item of expensePerCategorie) {
      if (item.total != 0) {
        let newVal = {
          val1: item.categorie,
          val2: item.total,
        };
        tab.push(newVal);
      }
    }
    let totalExpWs = {
      val1: "Total sorties",
      val2: totalExpense,
    };
    tab.push(totalExpWs);
    tab.push(blank);

    let benefice = {
      val1: "Bénéfice",
      val2: totalIncome - totalExpense,
    };

    tab.push(benefice);

    let wsBalance = XLSX.utils.json_to_sheet(tab, { skipHeader: true });
    XLSX.utils.book_append_sheet(wb, wsBalance, "Résumé");

    // heading entrées/sorties

    let heading = [["Date", "Compte", "Pièce", "Libellé", "Montant CHF"]];

    // Feuille des entrées
    let newIncome = [];
    for (const inc of income) {
      let incProv = {
        date: inc.date,
        categorie: inc.categorie,
        piece: inc.piece,
        desc: inc.desc,
        prix: inc.prix,
      };
      newIncome.push(incProv);
    }
    let totalInc = {
      date: "",
      categorie: "",
      piece: "",
      desc: "Total",
      prix: totalIncome,
    };
    newIncome.push(totalInc);
    let wsIncome = XLSX.utils.json_to_sheet(newIncome, { origin: "A2", skipHeader: true });
    XLSX.utils.sheet_add_aoa(wsIncome, heading); //heading: array of arrays
    XLSX.utils.book_append_sheet(wb, wsIncome, "Entrées");

    //feuille des sorties

    let newExpense = [];
    for (const exp of expense) {
      let expProv = {
        date: exp.date,
        categorie: exp.categorie,
        piece: exp.piece,
        desc: exp.desc,
        prix: exp.prix,
      };
      console.log(exp);
      newExpense.push(expProv);
    }

    let totalExp = {
      date: "",
      categorie: "",
      piece: "",
      desc: "Total",
      prix: totalExpense,
    };
    newExpense.push(totalExp);
    let wsExpense = XLSX.utils.json_to_sheet(newExpense, { origin: "A2", skipHeader: true });
    XLSX.utils.sheet_add_aoa(wsExpense, heading); //heading: array of arrays

    XLSX.utils.book_append_sheet(wb, wsExpense, "Sorties");

    XLSX.writeFile(wb, "comptabilitee.xlsx");
  };

  const GeneratePDF = () => {
    return (
      <>
        <PDFDownloadLink
          className="cursor-pointer bg-blue-500 max-w-xs text-center hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:border-gray-500"
          id="pdf"
          document={
            <MyDocument
              incomePerCategorie={incomePerCategorie}
              expensePerCategorie={expensePerCategorie}
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              infos={infos}
            />
          }
          fileName="entree.pdf"
        >
          {({ blob, url, loading, error }) => (loading ? "Loading document..." : "Download PDF!")}
        </PDFDownloadLink>
        <br />
      </>
    );
  };

  return (
    <React.Fragment>
      <Head>
        <title>Deduct All Taxes - MF</title>
      </Head>
      <div className="grid grid-col-1 text-2xl w-full ">
        <Nav />
        <div className="mt-20 bg-white shadow-md rounded px-8 pt-6 pb-8 crediteur">
          <h1 className="text-6xl font-normal leading-normal mt-0 mb-2 text-gray-800">Résumé</h1>
        </div>
        <div className="flex-wrap flex flex-col justify-center bg-white shadow-md rounded px-8 pt-6 pb-8">
          <h2 style={{ fontWeight: "bold", marginBottom: "20px" }}>Chiffre d'affaire</h2>
          {incomePerCategorie.map((item, index) => {
            if (item.total != 0) {
              return (
                <div className="flex ">
                  <p className="w-96">{item.categorie} : </p>
                  <p> {item.total} CHF</p>
                </div>
              );
            }
            return;
          })}
          <div className="flex " style={{ fontWeight: "bold" }}>
            <p className="w-96">total entrées :</p> <p>{totalIncome} CHF</p>
          </div>
          <hr style={{ marginBottom: "30px", marginTop: "30px" }}></hr>
          <h2 style={{ fontWeight: "bold", marginBottom: "20px" }}>Frais</h2>
          {expensePerCategorie.map((item, index) => {
            if (item.total != 0) {
              return (
                <div className="flex ">
                  <p className="w-96">{item.categorie} :</p>
                  <p>{item.total} CHF</p>
                </div>
              );
            }
            return;
          })}
          <div className="flex" style={{ fontWeight: "bold" }}>
            <p className="w-96">total sorties :</p> <p>{totalExpense} CHF</p>
          </div>
          <hr style={{ marginBottom: "30px", marginTop: "30px" }}></hr>
          <div className="flex" style={{ fontWeight: "bold" }}>
            <p className="w-96">Résultat :</p> <p> {(totalIncome - totalExpense).toFixed(2)} CHF</p>
          </div>
          <br />

          {!clicked && (
            <>
              <br />
              <div
                className="cursor-pointer bg-blue-500 max-w-xs text-center hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:border-gray-500"
                onClick={(e) => {
                  e.preventDefault();
                  setClicked(true);
                  GeneratePDF();
                }}
              >
                Générer PDF
              </div>
            </>
          )}
          <br />
          {clicked && (
            <GeneratePDF className="cursor-pointer bg-blue-500 max-w-xs text-center hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:border-gray-500" />
          )}
          <div
            className="cursor-pointer bg-blue-500 max-w-xs text-center hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:border-gray-500"
            onClick={(e) => {
              e.preventDefault();
              handleExportXlsx();
            }}
          >
            Exporter pour excel
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Home;
