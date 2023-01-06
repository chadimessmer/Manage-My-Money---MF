import React, { useRef, useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useStateContext } from "../lib/context";
import { v4 as uuidv4 } from "uuid";
import Nav from "../components/nav";
import { TbArrowsSort } from "react-icons/tb";
import MyDocument from "../components/pdfTest";
import { CSVLink } from "react-csv";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { usePDF, Document, Page } from "@react-pdf/renderer";
import * as XLSX from "xlsx/xlsx.mjs";

function Home() {
  const { incomeCategorie, income, setIncome, totalIncome } = useStateContext();
  const [sortState, setSortState] = useState(true);
  const [incomeDisplay, setIncomeDisplay] = useState(income);
  const [filterBy, setFilterBy] = useState("desc");
  const [totalIncomeDisplay, setTotalIncomeDisplay] = useState(0);
  const [filterValue, setFilterValue] = useState("");

  const [clicked, setClicked] = useState(false);

  const headers = [
    { label: "Date", key: "date" },
    { label: "Catégorie", key: "categorie" },
    { label: "Description", key: "desc" },
    { label: "Prix", key: "prix" },
  ];

  useState(() => {
    setClicked(false);
    console.log("fe");
  }, [income]);

  useEffect(() => {
    setIncomeDisplay([...income]);
    console.log(incomeDisplay);
  }, [income]);

  useEffect(() => {
    if (income.length > 0) {
      let total = 0;
      for (const facture of income) {
        if (facture[filterBy].toLowerCase().includes(filterValue.toLowerCase())) {
          if (facture.prix != "" || facture.prix == isNaN) {
            let thisFacture = parseFloat(facture.prix);
            total += thisFacture;
          }
        }
      }
      setTotalIncomeDisplay(total.toFixed(2));
    } else {
      setTotalIncomeDisplay(0);
    }
  }, [filterValue, income]);

  const pdfRef = useRef();

  const addMore = (e) => {
    e.preventDefault();
    let newField = { date: "", categorie: "", desc: "", prix: "", id: uuidv4() };
    setIncome([...income, newField]);
    setClicked(false);
  };

  const removeIncome = (index) => {
    let allIncome = [...income];
    allIncome.splice(index, 1);
    setClicked(false);

    setIncome(allIncome);
  };

  const handleFormChange = (index, event) => {
    let data = [...income];
    let thisValue = event.target.value;
    if (event.target.name === "prix") {
      let number;
      if (thisValue != "") {
        number = parseFloat(thisValue);
      } else {
        number = thisValue;
      }
      data[index][event.target.name] = number;
    } else {
      data[index][event.target.name] = thisValue;
    }
    setIncome(data);
    setClicked(false);
  };
  const sortBy = (cat) => {
    if (sortState) {
      setIncome([...income].sort((a, b) => (a[cat] < b[cat] ? 1 : -1)));
      setSortState(false);
    } else {
      setIncome([...income].sort((a, b) => (a[cat] > b[cat] ? 1 : -1)));
      setSortState(true);
    }
  };

  const GeneratePDF = () => {
    return (
      <>
        <PDFDownloadLink
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:border-gray-500"
          id="pdf"
          document={<MyDocument totalIncome={totalIncomeDisplay} income={incomeDisplay} />}
          fileName="entree.pdf"
        >
          {({ blob, url, loading, error }) => (loading ? "Loading document..." : "Download PDF!")}
        </PDFDownloadLink>
        <br />
      </>
    );
  };

  const handleSearch = (event) => {
    let value = event.target.value;
    const filter = income.filter((item) => {
      return item[filterBy].toLowerCase().includes(value.toLowerCase());
    });
    setIncomeDisplay(filter);
    setFilterValue(value);
    setClicked(false);
  };

  return (
    <React.Fragment>
      <Head>
        <title>Home - Pay less</title>
      </Head>
      <div className="grid grid-col-1 text-2xl w-full ">
        <Nav />
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 crediteur">
          <h1 className="text-6xl font-normal leading-normal mt-0 mb-2 text-gray-800">Entrées</h1>
        </div>
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8">
          Recherche :
          <div className="ml-5  inline-block relative w-64">
            <select
              className="block appearance-none w-full bg-white border   px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:border-gray-500"
              name="categorie"
              id="currency"
              value={filterBy}
              onChange={(event) => setFilterBy(event.target.value)}
            >
              <option value="categorie">Compte</option>
              <option value="desc">Libellé</option>

              {/* <option value="CHF">CHF</option>
                      <option value="EUR">EUR</option> */}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>{" "}
          <input
            className="shadow  appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-500"
            type="text"
            onChange={(event) => handleSearch(event)}
          />
          <div className="entree title bg-white  rounded ">
            <div className="date">
              Date <TbArrowsSort onClick={() => sortBy("date")} />
            </div>
            <div className="categorie">
              Compte <TbArrowsSort onClick={() => sortBy("categorie")} />
            </div>
            <div className="description">
              Libellé <TbArrowsSort onClick={() => sortBy("desc")} />
            </div>
            <div className="prix">
              Montant
              <TbArrowsSort onClick={() => sortBy("prix")} />
            </div>
          </div>
          <div>
            {income.map((input, index) => {
              if (input[filterBy].toLowerCase().includes(filterValue.toLowerCase())) {
                return (
                  <div className="entree" key={input.id}>
                    <input
                      className="date shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-500"
                      type="date"
                      name="date"
                      value={input.date}
                      onChange={(event) => handleFormChange(index, event)}
                    />

                    <div className="inline-block relative w-64">
                      <select
                        className="block appearance-none w-full bg-white border   px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:border-gray-500"
                        name="categorie"
                        id="currency"
                        value={input.categorie}
                        onChange={(event) => handleFormChange(index, event)}
                      >
                        <option value=""></option>
                        {incomeCategorie.map((input, index) => {
                          return (
                            <option value={input} key={index}>
                              {input}
                            </option>
                          );
                        })}
                        {/* <option value="CHF">CHF</option>
                      <option value="EUR">EUR</option> */}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>

                    <input
                      className="description shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-500"
                      type="text"
                      name="desc"
                      value={input.desc}
                      onChange={(event) => handleFormChange(index, event)}
                    />
                    <input
                      className="prix shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-500"
                      type="number"
                      value={input.prix}
                      name="prix"
                      onChange={(event) => handleFormChange(index, event)}
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeIncome(index);
                      }}
                      className="delete text-white font-bold py-2 px-4 w-11 rounded focus:outline-none focus:border-gray-500"
                    >
                      -
                    </button>
                  </div>
                );
              }
            })}
          </div>
          <div style={{ textAlign: "right" }}>total : {totalIncomeDisplay} CHF</div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:border-gray-500"
            onClick={addMore}
          >
            ajouter facture
          </button>
          <br />
          {!clicked && (
            <>
              <br />
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:border-gray-500"
                onClick={(e) => {
                  e.preventDefault();
                  setClicked(true);
                  GeneratePDF();
                }}
              >
                Générer PDF
              </button>
            </>
          )}
          <br />
          {clicked && (
            <GeneratePDF className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:border-gray-500" />
          )}
        </form>
      </div>
    </React.Fragment>
  );
}

export default Home;
