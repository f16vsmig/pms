<script>
  import Loading from "../etc/Loading.svelte";

  google.charts.load("current", { packages: ["corechart", "line"] });
  google.charts.setOnLoadCallback(drawBasic);

  let chartDiv;

  function drawBasic() {
    var data = new google.visualization.DataTable();
    data.addColumn("datetime", "Time");
    data.addColumn("number", "scheduled_kW");
    data.addColumn("number", "output_kW");

    data.addRows([
      [new Date(Date.now() - 5000 * 10), 50, 0],
      [new Date(Date.now() - 5000 * 9), 50, 10],
      [new Date(Date.now() - 5000 * 8), 50, 23],
      [new Date(Date.now() - 5000 * 7), 50, 17],
      [new Date(Date.now() - 5000 * 6), 50, 18],
      [new Date(Date.now() - 5000 * 5), 50, 9],
      [new Date(Date.now() - 5000 * 4), 50, 11],
      [new Date(Date.now() - 5000 * 3), 50, 27],
      [new Date(Date.now() - 5000 * 2), 50, 33],
      [new Date(Date.now() - 5000 * 1), 50, 40],
      [new Date(Date.now()), 50, 32],
    ]);

    let realtime = true;

    let options = {
      animation: {
        duration: 400,
        easing: "out",
      },
      legend: {
        position: "none",
      },
      series: {
        0: {
          color: "pink",
          visibleInLegend: false,
          lineDashStyle: [4, 4],
        },
        1: {
          color: "white",
          visibleInLegend: false,
        },
      },
      // colors: ["pink", "white"],
      chartArea: {
        width: "100%",
        height: "100%",
      },
      crosshair: {
        trigger: "both",
        orientation: "vertical",
      },
      focusTarget: "category",
      hAxis: {
        textPosition: "none",
        // baselineColor: "white",
        guidelines: {
          color: "white",
        },
        viewWindow: {
          min: new Date(Date.now() - 5000 * 10),
          max: new Date(Date.now() + 5000 * 3),
        },
      },
      vAxis: {
        textPosition: "none",
        // baselineColor: "white",
        guidelines: {
          color: "white",
        },
        textPosition: "none",
      },
      backgroundColor: {
        fill: "#696969",
        stroke: "white",
      },
      tooltip: {
        // isHtml: true,
        textStyle: {
          //  color: <string>,
          // fontName: <string>,
          fontSize: 12,
          // bold: <boolean>,
          // italic: <boolean> }
        },
      },
    };

    var chart = new google.visualization.LineChart(chartDiv);

    chart.draw(data, options);

    setInterval(function () {
      if (realtime) {
        data.addRows([[new Date(Date.now()), 70, 70 + Math.round(10 * Math.random())]]);
        options.hAxis.viewWindow.min = new Date(Date.now() - 5000 * 10);
        options.hAxis.viewWindow.max = new Date(Date.now() + 5000 * 3);
        chart.draw(data, options);
      }
    }, 5000);
  }
</script>

<div bind:this={chartDiv} class="w-full text-center" style="height: 130px;">
  <Loading />
</div>
