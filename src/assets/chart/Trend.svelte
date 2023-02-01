<script>
  import Loading from "../etc/Loading.svelte";

  let chartDiv;
  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(drawChart);
  function drawChart() {
    var data = google.visualization.arrayToDataTable([
      ["Age", "Weight"],
      [8, 12],
      [4, 5.5],
      [11, 14],
      [4, 5],
      [3, 3.5],
      [6.5, 7],
    ]);

    var options = {
      title: "Age vs. Weight comparison",
      legend: "none",
      crosshair: { trigger: "both", orientation: "both" },
      trendlines: {
        0: {
          type: "polynomial",
          degree: 3,
          visibleInLegend: true,
        },
      },
    };

    var chart = new google.visualization.ScatterChart(chartDiv);
    chart.draw(data, options);
  }
</script>

<div bind:this={chartDiv} class="w-full text-center" style="height: 130px;">
  <Loading />
</div>
