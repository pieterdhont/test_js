"use strict";

vulGroenteSelect();
initialiseerEventListeners();

async function vulGroenteSelect() {
  const response = await fetch("groenten.json");

  if (response.ok) {
    const groenten = await response.json();
    const groenteSelect = document.getElementById("groente");

    groenten.forEach((groente) => {
      const optie = document.createElement("option");
      optie.value = groente.prijs;
      optie.textContent = `${groente.naam} (${groente.prijs}/${groente.eenheid})`;
      groenteSelect.appendChild(optie);
    });
  } else {
    toonFoutmelding("Fout bij het laden van gegevens.");
  }
}

function initialiseerEventListeners() {
  const groenteSelect = document.getElementById("groente");

  groenteSelect.addEventListener("change", () => {
    document.getElementById("foutmelding").textContent = "";
  });

  document.getElementById("aantal").addEventListener("input", () => {
    document.getElementById("foutmelding").textContent = "";
  });

  document.getElementById("toevoegen").addEventListener("click", () => {
    const gekozenGroente = groenteSelect.selectedOptions[0].textContent.split(" (")[0];
    const gekozenGroenteIndex = groenteSelect.selectedIndex;
    const aantal = parseInt(document.getElementById("aantal").value);
    const prijs = parseFloat(groenteSelect.value);

    if (gekozenGroenteIndex === 0) {
      toonFoutmelding("Selecteer een groente");
      return;
    }
    if (isNaN(aantal) || aantal < 1) {
      toonFoutmelding("Voer een geldig aantal in (minstens 1)");
      return;
    }
    UpdateOfMaakRij(gekozenGroente, aantal, prijs);
    berekenTotaal();
  });
}

function toonFoutmelding(bericht) {
  document.getElementById("foutmelding").textContent = bericht;
}

function UpdateOfMaakRij(gekozenGroente, aantal, prijs) {
  const bestellingTbody = document.getElementById("bestelling");
  const bestaandeRij = Array.from(bestellingTbody.children).find(
    (rij) => rij.children[0].textContent === gekozenGroente);

  if (bestaandeRij) {
    const huidigAantal = parseInt(bestaandeRij.children[1].textContent);
    const nieuwAantal = huidigAantal + aantal;
    const nieuwTeBetalen = nieuwAantal * prijs;

    bestaandeRij.children[1].textContent = nieuwAantal;
    bestaandeRij.children[3].textContent = nieuwTeBetalen.toFixed(2);
  } else {
    const teBetalen = aantal * prijs;
    voegRijToe(gekozenGroente, aantal, prijs, teBetalen);
  }
}

function voegRijToe(groente, aantal, prijs, teBetalen) {
  const bestellingTbody = document.getElementById("bestelling");
  const rij = document.createElement("tr");

  const groenteCell = document.createElement("td");
  groenteCell.textContent = groente;
  rij.appendChild(groenteCell);

  const aantalCell = document.createElement("td");
  aantalCell.textContent = aantal;
  rij.appendChild(aantalCell);

  const prijsCell = document.createElement("td");
  prijsCell.textContent = prijs.toFixed(2);
  rij.appendChild(prijsCell);

  const teBetalenCell = document.createElement("td");
  teBetalenCell.textContent = teBetalen.toFixed(2);
  rij.appendChild(teBetalenCell);

  const verwijderCell = document.createElement("td");
  const verwijderImg = document.createElement("img");
  verwijderImg.src = "vuilbak.png";
  verwijderImg.alt = "Verwijder";
  verwijderImg.addEventListener("click", () => {
    bestellingTbody.removeChild(rij);
    berekenTotaal();
  });
  verwijderCell.appendChild(verwijderImg);
  rij.appendChild(verwijderCell);

  bestellingTbody.appendChild(rij);
}

function berekenTotaal() {
  const bestellingTbody = document.getElementById("bestelling");
  const totaalCell = document.getElementById("totaal");
      totaalCell.textContent = Array.from(bestellingTbody.children)
      .reduce((totaal, rij) => totaal + parseFloat(rij.children[3].textContent),0)
      .toFixed(2);
}
  
    
