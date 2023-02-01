<script>
  import Loading from "../etc/Loading.svelte";

  let chartDiv;

  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(drawChart);
  function drawChart() {
    var data = google.visualization.arrayToDataTable([
      ["Task", "Hours per Day"],
      ["Work", 11],
      ["Eat", 2],
      ["Commute", 2],
      ["Watch TV", 2],
      ["Sleep", 7],
    ]);

    var options = {
      title: "My Daily Activities",
      pieHole: 0.4,
    };

    var chart = new google.visualization.PieChart(chartDiv);
    chart.draw(data, options);
  }
</script>

<div bind:this={chartDiv} class="w-full text-center" style="height: 130px;">
  <Loading />
</div>
