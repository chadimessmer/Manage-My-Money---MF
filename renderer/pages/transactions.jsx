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
  const { transaction, setTransaction, incomeCategorie, income, setIncome, totalIncome, expenseCategorie, infos } = useStateContext();
  const [sortState, setSortState] = useState(true);
  const [incomeDisplay, setIncomeDisplay] = useState(transaction);
  const [filterBy, setFilterBy] = useState("desc");
  const [totalIncomeDisplay, setTotalIncomeDisplay] = useState(0);
  const [filterValue, setFilterValue] = useState("");
  const [displayTransaction, setDisplayTransaction] = useState("all");

  const [clicked, setClicked] = useState(false);

  const headers = [
    { label: "Date", key: "date" },
    { label: "Catégorie", key: "categorie" },
    { label: "Description", key: "desc" },
    { label: "Prix", key: "prix" },
  ];
  const inputRef = useRef(null);

  useState(() => {
    setClicked(false);
    console.log("fe");
  }, [transaction]);

  useEffect(() => {
    setIncomeDisplay([...transaction]);
    console.log(incomeDisplay);
  }, [transaction]);

  useEffect(() => {
    console.log(displayTransaction);
  }, [displayTransaction]);

  useEffect(() => {
    if (transaction.length > 0) {
      let total = 0;
      for (const facture of transaction) {
        if (String(facture[filterBy]).toLowerCase().includes(filterValue.toLowerCase())) {
          if (facture.prix != "" || facture.prix == isNaN) {
            let thisFacture = parseFloat(facture.prix);
            if (facture.in && (displayTransaction == "all" || displayTransaction == "income")) {
              total += thisFacture;
            } else if (!facture.in && (displayTransaction == "all" || displayTransaction == "expense")) {
              total -= thisFacture;
            }
          }
        }
      }
      setTotalIncomeDisplay(total.toFixed(2));
    } else {
      setTotalIncomeDisplay(0);
    }
  }, [filterValue, transaction, displayTransaction]);

  const pdfRef = useRef();

  const addMore = (e) => {
    e.preventDefault();
    let newField = { date: "", categorie: "-", piece: "", desc: "", prix: "", in: true, id: uuidv4() };
    setTransaction([newField, ...transaction]);
    setClicked(false);
  };
  const addLess = (e) => {
    e.preventDefault();
    let newField = { date: "", categorie: "-", piece: "", desc: "", prix: "", in: false, id: uuidv4() };
    setTransaction([newField, ...transaction]);
    setClicked(false);
  };

  const removeIncome = (index) => {
    let allIncome = [...transaction];
    allIncome.splice(index, 1);
    setClicked(false);

    setTransaction(allIncome);
  };

  const handleFormChange = (index, event) => {
    let data = [...transaction];
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
    setTransaction(data);
    setClicked(false);
  };
  const sortBy = (cat) => {
    if (sortState) {
      setTransaction([...transaction].sort((a, b) => (a[cat] < b[cat] ? 1 : -1)));
      setSortState(false);
    } else {
      setTransaction([...transaction].sort((a, b) => (a[cat] > b[cat] ? 1 : -1)));
      setSortState(true);
    }
  };

  const GeneratePDF = () => {
    return (
      <>
        <PDFDownloadLink
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:border-gray-500"
          id="pdf"
          document={<MyDocument totalIncome={totalIncomeDisplay} income={incomeDisplay} infos={infos} />}
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
    const filter = transaction.filter((item) => {
      if ((displayTransaction == "income" && item.in) || (displayTransaction == "expense" && !item.in) || displayTransaction == "all") {
        return String(item[filterBy]).toLowerCase().includes(value.toLowerCase());
      }
    });
    setIncomeDisplay(filter);
    setFilterValue(value);
    setClicked(false);
  };

  useEffect(() => {
    const filter = transaction.filter((item) => {
      if ((displayTransaction == "income" && item.in) || (displayTransaction == "expense" && !item.in) || displayTransaction == "all") {
        if (filterBy != "") {
          return String(item[filterBy]).toLowerCase().includes(filterValue.toLowerCase());
        }
      }
    });
    setIncomeDisplay(filter);
    setClicked(false);
  }, [displayTransaction]);

  function onReaderLoad(e) {
    if (e.target.files) {
      let filesData = [];
      let promises = [];
      for (let i = 0; i < e.target.files.length; i++) {
        var reader = new FileReader();
        let promise = new Promise((resolve) => {
          reader.onload = (event) => {
            var obj = JSON.parse(event.target.result);
            let totalPrice = 0;
            let factures = obj.factures;
            for (const facture of factures) {
              totalPrice += parseFloat(facture.prix);
            }
            let newField = { date: obj.date, categorie: "", piece: "", desc: obj.title, prix: totalPrice, in: true, id: uuidv4() };
            filesData.push(newField);
            resolve();
          };
        });
        promises.push(promise);
        reader.readAsText(e.target.files[i]);
      }
      Promise.all(promises).then(() => {
        setTransaction([...filesData, ...transaction]);
        setClicked(false);
        inputRef.current.value = "";
      });
    }
  }

  useEffect(() => {
    console.log(transaction);
  });

  return (
    <React.Fragment>
      <Head>
        <title>Home - Pay less</title>
      </Head>
      <div className="grid grid-col-1 text-2xl w-full ">
        <Nav />
        <div className="mt-20 bg-white shadow-md rounded px-8 pt-6 pb-8 crediteur">
          <h1 className="text-6xl font-normal leading-normal mt-0 mb-2 text-gray-800">Transactions</h1>
        </div>
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8">
          Afficher :
          <div className="mr-5 ml-5 inline-block relative w-64">
            <select
              className="block appearance-none w-full bg-white border   px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:border-gray-500"
              name="categorie"
              id="currency"
              value={displayTransaction}
              onChange={(event) => {
                setDisplayTransaction(event.target.value);
              }}
            >
              <option value="all">Tout</option>
              <option value="income">Entrées</option>
              <option value="expense">Sorties</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          <br /> <br />
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
              <option value="piece">Pièce</option>
              <option value="prix">Prix</option>
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
            className="shadow  appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-500"
            type="text"
            onChange={(event) => handleSearch(event)}
          />
          <hr style={{ marginBottom: "30px", marginTop: "30px" }}></hr>
          <label className="block text-gray-700 " htmlFor="import">
            Importer facture Pay Your Bill (.json)
          </label>
          <input
            ref={inputRef}
            className="form-control block px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            onChange={(e) => {
              onReaderLoad(e);
            }}
            type="file"
            accept="application/JSON"
            multiple
          />
          <hr style={{ marginBottom: "30px", marginTop: "30px" }}></hr>
          <div className="flex mb-5">
            {(displayTransaction == "all" || displayTransaction == "income") && (
              <div
                className="mr-5 cursor-pointer bg-green-500 max-w-xs hover:bg-green-700 text-center text-white font-bold py-2 px-4 rounded focus:outline-none focus:border-gray-500"
                onClick={addMore}
              >
                ajouter entrée
              </div>
            )}
            {(displayTransaction == "all" || displayTransaction == "expense") && (
              <div
                className="cursor-pointer bg-red-500 max-w-xs hover:bg-red-700 text-center text-white font-bold py-2 px-4 rounded focus:outline-none focus:border-gray-500"
                onClick={addLess}
              >
                ajouter sortie
              </div>
            )}
          </div>
          <div className="entree title bg-white  rounded ">
            <div className="date">
              Date <TbArrowsSort onClick={() => sortBy("date")} />
            </div>
            <div className="categorie">
              Compte <TbArrowsSort onClick={() => sortBy("categorie")} />
            </div>
            <div className="piece">
              Pièce <TbArrowsSort onClick={() => sortBy("piece")} />
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
            {transaction.map((input, index) => {
              if ((displayTransaction == "income" && input.in) || (displayTransaction == "expense" && !input.in) || displayTransaction == "all")
                if (String(input[filterBy]).toLowerCase().includes(filterValue.toLowerCase())) {
                  return (
                    <div className="entree" key={input.id}>
                      <input
                        className="date mt-1 mb-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-500"
                        type="date"
                        name="date"
                        value={input.date}
                        onChange={(event) => handleFormChange(index, event)}
                      />

                      <div className="inline-block  relative w-64">
                        <select
                          className="block  appearance-none w-full bg-white border   px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:border-gray-500"
                          name="categorie"
                          id="currency"
                          value={input.categorie}
                          onChange={(event) => handleFormChange(index, event)}
                        >
                          {input.in
                            ? incomeCategorie.map((input, index) => {
                                return (
                                  <option value={input} key={index}>
                                    {input}
                                  </option>
                                );
                              })
                            : expenseCategorie.map((input, index) => {
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
                        className="piece shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-500"
                        type="number"
                        name="piece"
                        value={input.piece}
                        onChange={(event) => handleFormChange(index, event)}
                      />

                      <input
                        className="description shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-500"
                        type="text"
                        name="desc"
                        value={input.desc}
                        onChange={(event) => handleFormChange(index, event)}
                      />
                      <input
                        className={`${
                          input.in ? "bg-green-100 " : "bg-red-100 "
                        }prix shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-500`}
                        type="number"
                        value={input.prix}
                        name="prix"
                        onChange={(event) => handleFormChange(index, event)}
                      />
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          removeIncome(index);
                        }}
                        className="cursor-pointer delete text-white font-bold py-2 px-4 w-11 rounded focus:outline-none focus:border-gray-500"
                      >
                        -
                      </div>
                    </div>
                  );
                }
            })}
          </div>
          <div style={{ textAlign: "right" }}>total : {totalIncomeDisplay} CHF</div>
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
            <GeneratePDF className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:border-gray-500" />
          )}
        </form>
      </div>
    </React.Fragment>
  );
}

export default Home;
