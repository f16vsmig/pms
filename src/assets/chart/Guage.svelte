<script>
  import Loading from "../etc/Loading.svelte";

  google.charts.load("current", { packages: ["gauge"] });
  google.charts.setOnLoadCallback(drawChart);

  let chartDiv;

  function drawChart() {
    var data = google.visualization.arrayToDataTable([
      ["Label", "Value"],
      ["Power", 3500],
    ]);

    var options = {
      width: 120,
      height: 120,
      greenFrom: 3200,
      greenTo: 3700,
      minorTicks: 5,
      max: 5000 + 500,
    };

    var chart = new google.visualization.Gauge(chartDiv);

    chart.draw(data, options);

    setInterval(function () {
      data.setValue(0, 1, 3500 + Math.round(200 * Math.random()));
      chart.draw(data, options);
    }, 1000);
  }
</script>

<div bind:this={chartDiv} class="w-full text-center" style="height: 130px;">
  <Loading />
</div>
