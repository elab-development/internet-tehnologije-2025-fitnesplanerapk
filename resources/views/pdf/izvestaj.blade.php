<!-- <h1>Izveštaj za: {{ $ime }}</h1>
<p>Datum generisanja: {{ $datum }}</p>
<p>Ovde je tvoj izvestaj:</p> -->

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Helvetica', sans-serif; text-align: center; color: #333; }
        .header { margin-bottom: 20px; border-bottom: 2px solid #3B82F6; padding-bottom: 10px; }
        .chart-container { margin-bottom: 30px; padding: 10px; }
        .chart-container h3 { font-size: 16px; margin-bottom: 10px; color: #1F2937; }
        img { width: 550px; height: auto; }
        .page-break { page-break-after: always; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Fitness Izvestaj za {{ $ime }}</h1>
        <p>Period: Poslednjih 10 merenja | Datum: {{ $datum }}</p>
    </div>

    <div class="chart-container">
        <h3>Trend Tezine (kg)</h3>
        <img src="{{ $chartTezinaUrl }}">
    </div>

    

    <div class="chart-container">
        <h3>Dnevna Hidriranost (L)</h3>
        <img src="{{ $chartVodaUrl }}">
    </div>

    

    <div class="page-break"></div> <div class="chart-container">
        <h3>Procenat Masti i Misica (%)</h3>
        <img src="{{ $chartSastavUrl }}">
    </div>

    

</body>
</html>