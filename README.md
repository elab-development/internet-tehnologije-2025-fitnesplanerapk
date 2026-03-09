<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

# Personalizovani Fitness Planner

## Informacije o projektu

Univerzitet u Beogradu
Fakultet organizacionih nauka
Katedra za elektronsko poslovanje

Predmet: **Internet tehnologije**

Mentor: **Petar Lukovac**

GitHub repozitorijum:
https://github.com/elab-development/internet-tehnologije-2025-fitnesplanerapk

---

# Autori
- Nevena Vidojević (2022/0081)  
- Hristina Vidaković (2022/0076)  
- Kristina Atanasković (2022/0092)  

---

# Opis aplikacije

**Personalizovani Fitness Planner** je web aplikacija namenjena korisnicima koji žele da planiraju i prate svoje fitness aktivnosti.

Aplikacija omogućava korisnicima da:

* kreiraju personalizovane trening programe
* prate unos kalorija kroz plan ishrane
* prate dnevni unos tečnosti
* evidentiraju parametre kao što su težina, visina i BMI
* analiziraju svoj napredak kroz vizualizaciju podataka

Cilj aplikacije je da korisnicima omogući bolju organizaciju treninga i ishrane, kao i praćenje napretka kroz vreme.

---

# Tehnologije

U projektu su korišćene sledeće tehnologije:

### Frontend

* React
* Vite
* Axios
* Tailwind CSS

### Backend

* Laravel (PHP framework)

### Baza podataka

* MySQL

### Komunikacija

* REST API
* JSON

---

# Arhitektura sistema

Aplikacija koristi **klijent-server arhitekturu**.

* React aplikacija radi u browseru i šalje HTTP zahteve backendu koristeći Axios.
* Laravel aplikacija predstavlja backend API, obrađuje zahteve, komunicira sa bazom podataka i vraća odgovore u JSON formatu.
* Komunikacija se odvija putem HTTP REST zahteva.
* Podaci se razmenjuju u JSON formatu.
* MySQL se koristi za čuvanje svih podataka aplikacije.

---

# DevOps i infrastruktura

U projektu se koriste sledeće DevOps tehnologije:

- Docker za pokretanje aplikacije u kontejnerima
- docker-compose za orkestraciju servisa
- GitHub za verzionisanje koda
- GitHub Actions za CI/CD pipeline
- Cloud deployment (Azure / AWS / DigitalOcean)

---

# Eksterni API servisi

Aplikacija koristi nekoliko eksternih API servisa.

## USDA FoodData Central API

Koristi se za pretragu nutritivnih vrednosti namirnica.

---

## ZenQuotes API

Koristi se za prikaz motivacionih citata na dashboard-u.

Endpoint:

https://zenquotes.io/api/random

# Glavne funkcionalnosti

Aplikacija omogućava:

## Upravljanje korisnicima
- registraciju i prijavu korisnika
- autentifikaciju pomoću tokena
- upravljanje ulogama korisnika

## Upravljanje treninzima
- kreiranje personalizovanih trening programa
- izbor vežbi iz baze
- podešavanje parametara vežbi (serije, ponavljanja, trajanje, težina, BPM)
- pregled trening programa
- brisanje i izmena programa

## Upravljanje ishranom
- unos obroka po danima
- unos namirnica i nutritivnih vrednosti
- automatski obračun kalorija
- pregled dnevnog kalorijskog unosa

## Praćenje hidriranosti
- unos količine popijene vode
- pregled dnevne hidriranosti
- praćenje napretka u odnosu na cilj

## Praćenje napretka
- grafički prikaz promene telesnih parametara
- istorija ciljeva
- statistika hidriranosti

---

# Uloge u sistemu

## Korisnik
Korisnik ima mogućnost da:
- registruje i prijavi nalog
- unese svoje fizičke parametre
- postavi ciljeve
- kreira trening programe
- upravlja planom ishrane
- prati hidriranost
- pregleda statistiku napretka

Korisnik nema pristup podacima drugih korisnika.

---

## Admin
Administrator ima mogućnost da:
- se prijavi na sistem
- vidi listu korisnika
- dodaje vežbe u bazu
- briše vežbe
- upravlja bazom vežbi

---

## Trener
Trener ima mogućnost da:
- pregleda bazu vežbi
- kreira trening programe
- omogući korisnicima da koriste pripremljene treninge

---

# Pokretanje aplikacije

## Kloniranje projekta

```bash
git clone https://github.com/elab-development/internet-tehnologije-2025-fitnesplanerapk.git
cd internet-tehnologije-2025-fitnesplanerapk
```

---

# Backend (Laravel)

Instalacija zavisnosti:

```bash
composer install
```

Kreiranje `.env` fajla:

```bash
cp .env.example .env
```

Generisanje ključa:

```bash
php artisan key:generate
```

Migracija baze:

```bash
php artisan migrate
```

Pokretanje servera:

```bash
php artisan serve
```

Backend će biti dostupan na:

```
http://127.0.0.1:8000
```

---

# Frontend (React)

Prelazak u React folder:

```bash
cd react
```

Instalacija zavisnosti:

```bash
npm install
```

Pokretanje aplikacije:

```bash
npm run dev
```

Frontend će biti dostupan na:

```
http://127.0.0.1:3000
```

---

# Pokretanje pomoću Docker-a


docker-compose up --build


Ova komanda pokreće:

- React frontend
- Laravel backend
- MySQL bazu

---

## Model podataka

### Entiteti i veze

- **Korisnik** (id, ime, birthday, pol, mail, username, pass, uloga_id)  
- **Uloga** (id, ime)  
- **Parametri** (id, date, tezina, visina, bmi, masti, misici, obim_struka, korisnik_id)  
- **Cilj** (id, hidriranost, tezina, dnevne_kalorije, korisnik_id)  
- **Hidriranost** (id, ukupno, datum, upozorenje, kolicina, korisnik_id)  
- **Ishrana** (id, naziv, ukupne_kalorije, datum, korisnik_id)  
- **Obrok** (id, tip, ukupne_kalorije, ishrana_id)  
- **Namirnice** (id, naziv, kalorije, tezina, tip, kolicina)  
- **Obrok_Namirnica** (obrok_id, namirnica_id)  
- **Program** (id, vreme, naziv, datum, potrosene_kalorije, trajanje, intenzitet, korisnik_id)  
- **Vežbe** (id, ime, snimak)  
- **Program_Vezba** (program_id, vezba_id, trajanje, broj, serija, ponavljanja, tezina, bpm, dan)  

---

## Funkcije, kontroleri i rute

| Funkcija               | Kontroler             | Ruta                       | UI ekran                       |
|------------------------|---------------------|----------------------------|--------------------------------|
| Login                  | AuthController      | POST /api/login            | Login                          |
| Registracija           | AuthController      | POST /api/register         | Register                       |
| Logout                 | AuthController      | POST /api/logout           | -                              |
| Pregled ciljeva        | CiljController      | GET /api/all-ciljevi      | Dashboard                      |
| Dodavanje cilja        | CiljController      | POST /api/cilj             | UserSetup                      |
| Pregled parametara     | ParametriController | GET /api/all-parametri     | Dashboard                      |
| Dodavanje parametara   | ParametriController | POST /api/parametri        | UserSetup                      |
| Pregled hidriranosti   | HidriranostController | GET /api/hidriranost-danas | Dashboard                      |
| Dodavanje hidriranosti | HidriranostController | POST /api/hidriranost      | Dashboard                      |
| Kreiranje programa     | ProgramController    | POST /api/program          | Dashboard                      |
| Brisanje programa      | ProgramController    | DELETE /api/program/{id}   | Dashboard                      |
| Pregled vežbi          | VezbeController      | GET /api/vezbe             | AdminDashboard, TrenerStranica |
| Dodavanje vežbi        | VezbeController      | POST /api/vezbe            | AdminDashboard                 |

---

# Bezbednost

Aplikacija koristi više bezbednosnih mehanizama:

- autentifikaciju pomoću tokena (Laravel Sanctum)
- hashovanje lozinki pomoću bcrypt algoritma
- CORS zaštitu
- CSRF zaštitu
- validaciju podataka na backendu
- zaštitu od XSS napada

---

# Automatizovani testovi

U projektu su implementirani automatizovani testovi pomoću Laravel PHPUnit framework-a.

Vrste testova:

- Feature testovi (testiranje API ruta)
- Integration testovi
- Unit testovi

Testovi proveravaju:

- registraciju i login korisnika
- pristup administrativnim rutama
- zaštitu podataka između korisnika
- validnost hashovanih lozinki

---

# Vizualizacija podataka

Za prikaz statistike koristi se biblioteka:

**react-google-charts**

Prikazani grafici:

- Donut grafikon dnevne hidriranosti
- Linijski grafikon promene težine i BMI
- Grafikon istorije ciljeva

---


## Uloge i permisije

- **Korisnik:** CRUD nad svojim planovima, ciljevima, hidriranošću  
- **Admin:** Upravljanje vežbama i korisnicima  
- **Gost:** Pregled vežbi i osnovnih funkcionalnosti, bez unosa podataka  

---


# Screenshotovi aplikacije

## Login stranica

![Login](images/login.png)

## Dashboard

![Dashboard](images/dashboard.png)

## Trening program

![Program](images/program.png)

## Pregled vežbi

![Vezbe](images/vezbe.png)

# Buduća unapređenja

* integracija sa Nutrition API servisima
* napredna statistika napretka
* mobilna optimizacija aplikacije

---

# Licenca

Ovaj projekat je razvijen u edukativne svrhe u okviru kursa **Internet tehnologije** na Fakultetu organizacionih nauka.
