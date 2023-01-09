var students = [
  { name: "Set 10 Bao Lì Xì", status: true, rate: 90 },
  { name: "Bộ Chén Đũa 6 Cái", status: true, rate: 5 },
  { name: "Xe Chòi Chân 3 Bánh", status: true, rate: 2 },
  { name: "Xe Chòi Chân Có Nhạc", status: true, rate: 0 },
  { name: "Xe Trượt Scooter Cho Bé", status: true, rate: 0 },
  { name: "Túi Xách Enfa Cho Mẹ", status: true, rate: 2 },
  { name: "Bộ Lều Huggies Cho Bé", status: true, rate: 4 },
  { name: "Đai Xe Máy Ngộ Nghĩnh", status: true, rate: 3 },
  { name: "Đĩa Sứ Cao Cấp 3 Chuẩn", status: true, rate: 10 },
  { name: "Bộ 6 Ly Trà Thuỷ Tinh", status: true, rate: 10 },
  { name: "Khay Mứt Tết Hoa Mai", status: true, rate: 0 },
  { name: "Lốc 6 Lon Yến Tết Khánh Hoà", status: true, rate: 10 },
  { name: "Set Bình + 6 Ly Thuỷ Tinh", status: true, rate: 0 },
  { name: "Set Chăn + Nón Noel Cho Bé", status: true, rate: 2 },
  { name: "Set Chăn Gối Grow", status: true, rate: 1 },
  { name: "Balo Chóng Gù Milo", status: true, rate: 2 },
  { name: "Balo Malto Cỡ Lớn Cho Bé", status: true, rate: 2 },
  { name: "Ly Giữ Nhiệt 7 Giờ", status: true, rate: 2 },
  { name: "Nồi Nấu Đa Năng", status: true, rate: 3 },
  { name: "Chai Nước Trái Cây Hàn Quốc", status: true, rate: 20 },
  { name: "Gối Đi Xe Máy", status: true, rate: 3 },
  { name: "Gấu Bông Cho Bé", status: true, rate: 5 },
  { name: "Ly Nhựa 2 Lớp Lock & Lock", status: true, rate: 2 },
  { name: "Voucher Mua Đồ Chơi 39k", status: true, rate: 10 },
  { name: "Voucher 5% Tối Đa 50k Mua Vitamin", status: true, rate: 10 },
];
var spec = 0;

const closeModal = () => {
  $("#modal").attr("show", "off");
};

var shuffle = function (o) {
  for (
    var j, x, i = o.length;
    i;
    j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x
  );
  return o;
};

$(function () {
  var studentContainer = $("#students ul");

  students.forEach(function (student) {
    var name = student.name;
    const item = localStorage.getItem(name);
    studentContainer.append(
      $(document.createElement("li"))
        .append(
          $(document.createElement("input"))
            .attr({
              id: "student-" + name,
              name: name,
              value: name,
              type: "checkbox",
              checked: item ? Boolean(+item) : student.status,
            })
            .change(function () {
              var cbox = $(this)[0];
              var segments = wheel.segments;
              var i = segments.indexOf(cbox.value);

              if (cbox.checked && i == -1) {
                segments.push(student);
                localStorage.setItem(name, 1);
              } else if (!cbox.checked && i != -1) {
                localStorage.setItem(name, 0);
                segments.splice(i, 1);
              }
              segments.sort();
              wheel.update();
            })
        )
        .append(
          $(document.createElement("label"))
            .attr({
              for: "student-" + name,
            })
            .text(name)
        )
    );
  });

  $("#students ul>li").tsort("input", {
    attr: "value",
  });

  var segments = [];
  $.each($("#students input:checked"), function (key, cbox) {
    segments.push(students.find((v) => v.name === cbox.value));
  });

  wheel.segments = segments;
  wheel.init();
  wheel.update();

  // Hide the address bar (for mobile devices)!
  setTimeout(function () {
    window.scrollTo(0, 1);
  }, 0);
});

var wheel = {
  angleCurrent: 0,
  angleDelta: 0,
  canvasContext: null,
  centerX: 300,
  centerY: 300,
  colorCache: [],
  downTime: 4000,
  frames: 0,
  maxSpeed: Math.PI / 16,
  segments: [],
  size: 290,
  spinStart: 0,
  timerDelay: 0,
  timerHandle: 0,
  upTime: 3000,

  spin: function () {
    // Start the wheel only if it's not already spinning
    if (wheel.timerHandle == 0) {
      let totalRate = 0;
      let sum = 0;

      wheel.spinStart = new Date().getTime();
      wheel.maxSpeed = Math.PI / 16; // Randomly vary how hard the spin is
      // wheel.maxSpeed = Math.PI / (16 + Math.random() * 10); // Randomly vary how hard the spin is
      wheel.frames = 0;

      wheel.segments.forEach((v) => {
        totalRate += v.rate;
      });
      const rand = Math.random() * totalRate;
      console.log(rand);
      wheel.segments.some((v, i) => {
        sum += v.rate;
        if (rand <= sum) {
          spec =
            (Math.PI * 2 * (wheel.segments.length - i - 1 + 0.5)) /
            wheel.segments.length;
          console.log(i);
          return true;
        }
      });

      wheel.timerHandle = setInterval(wheel.onTimerTick, wheel.timerDelay);
    }
  },

  onTimerTick: function () {
    wheel.frames++;
    wheel.draw();

    var duration = new Date().getTime() - wheel.spinStart;
    var progress = 0;
    var finished = false;

    if (duration < wheel.upTime) {
      progress = duration / wheel.upTime;
      wheel.angleDelta = wheel.maxSpeed * Math.sin((progress * Math.PI) / 2);
    } else {
      progress = duration / wheel.downTime;
      wheel.angleDelta = wheel.maxSpeed * Math.sin((progress * Math.PI) / 6);
      console.log(
        Math.round(wheel.angleCurrent * 10) / 10,
        Math.round(spec * 10) / 10
      );
      if (
        progress >= 1 &&
        Math.round(wheel.angleCurrent * 10) / 10 === Math.round(spec * 10) / 10
      ) {
        finished = true;
      }
    }
    if (!finished) wheel.angleCurrent += wheel.angleDelta;
    while (wheel.angleCurrent >= Math.PI * 2)
      // Keep the angle in a reasonable range
      wheel.angleCurrent -= Math.PI * 2;
    if (finished) {
      clearInterval(wheel.timerHandle);
      wheel.timerHandle = 0;
      wheel.angleDelta = 0;
      console.log(
        wheel.segments.length -
          Math.floor(
            (wheel.angleCurrent / (Math.PI * 2)) * wheel.segments.length
          ) -
          1
      );
      var i =
        wheel.segments.length -
        Math.floor(
          (wheel.angleCurrent / (Math.PI * 2)) * wheel.segments.length
        ) -
        1;

      $("#image").attr({
        src: `images/${wheel.segments[i].name}.png`,
        alt: wheel.segments[i].name,
      });
      $("#congra").text(() => wheel.segments[i].name.toUpperCase());
      setTimeout(() => {
        $("#modal").attr("show", "on");
      }, 1000);
    }
  },

  init: function (optionList) {
    try {
      wheel.initWheel();
      wheel.initCanvas();
      wheel.draw();
      $.extend(wheel, optionList);
    } catch (exceptionData) {
      alert("Wheel is not loaded " + exceptionData);
    }
  },

  initCanvas: function () {
    var canvas = $("#wheel #canvas").get(0);
    canvas.addEventListener("click", wheel.spin, false);
    wheel.canvasContext = canvas.getContext("2d");
  },

  initWheel: function () {
    shuffle(spectrum);
  },

  update: function () {
    // Ensure we start mid way on a item
    var r = Math.floor(Math.random() * wheel.segments.length);
    //var r = 0;
    wheel.angleCurrent = ((r + 0.5) / wheel.segments.length) * Math.PI * 2;

    wheel.draw();
  },

  draw: function () {
    wheel.clear();
    wheel.drawWheel();
    wheel.drawNeedle();
  },

  clear: function () {
    var ctx = wheel.canvasContext;
    ctx.clearRect(0, 0, 1000, 800);
  },

  drawNeedle: function () {
    var ctx = wheel.canvasContext;
    var centerX = wheel.centerX;
    var centerY = wheel.centerY;
    var size = wheel.size;

    ctx.lineWidth = 3;
    ctx.strokeStyle = "#000000";

    ctx.beginPath();

    ctx.moveTo(centerX + size - 40, centerY);
    ctx.lineTo(centerX + size + 20, centerY - 10);
    ctx.lineTo(centerX + size + 20, centerY + 10);
    ctx.fillStyle = "#e85f10";
    ctx.closePath();

    ctx.stroke();
    ctx.fill();
  },

  drawSegment: function (key, lastAngle, angle) {
    var ctx = wheel.canvasContext;
    var centerX = wheel.centerX;
    var centerY = wheel.centerY;
    var size = wheel.size;
    var value = wheel.segments[key].name;

    ctx.save();
    ctx.beginPath();

    // Start in the centre
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, size, lastAngle, angle, false); // Draw a arc around the edge
    ctx.lineTo(centerX, centerY); // Now draw a line back to the centre
    // Clip anything that follows to this area
    //ctx.clip(); // It would be best to clip, but we can double performance without it
    ctx.closePath();

    ctx.fillStyle = key % 2 ? "#eb9b10" : "#c24a0e";
    ctx.fill();
    ctx.stroke();

    // Now draw the text
    ctx.save(); // The save ensures this works on Android devices
    ctx.translate(centerX, centerY);
    ctx.rotate((lastAngle + angle) / 2);

    ctx.fillStyle = "#fcf0f0";
    ctx.fillText(value.substr(0, 20), size / 2 - 50, 0);
    ctx.restore();

    ctx.restore();
  },

  drawWheel: function () {
    var ctx = wheel.canvasContext;

    var angleCurrent = wheel.angleCurrent;
    var lastAngle = angleCurrent;

    var len = wheel.segments.length;

    var centerX = wheel.centerX;
    var centerY = wheel.centerY;
    var size = wheel.size;

    var PI2 = Math.PI * 2;

    ctx.lineWidth = 1;
    ctx.strokeStyle = "#000000";
    ctx.textBaseline = "middle";
    // ctx.textAlign = "center";
    ctx.font = "600 1.2em Arial";

    for (var i = 1; i <= len; i++) {
      var angle = PI2 * (i / len) + angleCurrent;
      wheel.drawSegment(i - 1, lastAngle, angle);
      lastAngle = angle;
    }
    // Draw a center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, PI2, false);
    ctx.closePath();

    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#000000";
    ctx.fill();
    ctx.stroke();

    // Draw outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, size, 0, PI2, false);
    ctx.closePath();

    let gradient = ctx.createLinearGradient(0, 0, 170, 0);
    gradient.addColorStop("0", "orange");
    gradient.addColorStop("1.0", "brown");

    ctx.lineWidth = 20;
    ctx.strokeStyle = gradient;
    ctx.stroke();
  },
};

var spectrum = [
  "#A2395B",
  "#A63552",
  "#AA3149",
  "#AE2D40",
  "#B22937",
  "#A23A53",
  "#924B6F",
  "#825C8B",
  "#6F6DA7",
  "#A63570",
  "#AC2F5A",
  "#B22944",
  "#B8232E",
  "#C11C17",
  "#A72A37",
  "#8D3857",
  "#734677",
  "#575597",
  "#A6358C",
  "#B43B6A",
  "#C24148",
  "#D04726",
  "#DE5003",
  "#B84D24",
  "#924A45",
  "#6C4766",
  "#434187",
  "#A650A0",
  "#B55A80",
  "#C46460",
  "#D36E40",
  "#E27A1D",
  "#B26331",
  "#824C45",
  "#523559",
  "#1F1D6D",
  "#A660AC",
  "#B67288",
  "#C68464",
  "#D69640",
  "#E6AA19",
  "#BC892E",
  "#926843",
  "#684758",
  "#3B256D",
  "#A670B8",
  "#B8878E",
  "#CA9E64",
  "#DCB53A",
  "#EFCE10",
  "#C8A628",
  "#A17E40",
  "#7A5658",
  "#502E72",
  "#80529A",
  "#98777A",
  "#B09C5A",
  "#C8C13A",
  "#E0E61A",
  "#C8C13A",
  "#B09C5A",
  "#98777A",
  "#80529A",
  "#502E72",
  "#675860",
  "#7E824E",
  "#95AC3C",
  "#ACD62A",
  "#ABBD4D",
  "#AAA470",
  "#A98B93",
  "#A670B8",
  "#3B256D",
  "#4C4D60",
  "#5D7553",
  "#6E9D46",
  "#80C837",
  "#89AE54",
  "#929471",
  "#9B7A8E",
  "#A660AC",
  "#1F1D6D",
  "#2A3F5D",
  "#35614D",
  "#40833D",
  "#4CA82B",
  "#629248",
  "#787C65",
  "#8E6682",
  "#A650A0",
  "#434187",
  "#3B536E",
  "#336555",
  "#2B773C",
  "#228B22",
  "#43763C",
  "#646156",
  "#854C70",
  "#A6358C",
  "#575597",
  "#4A678D",
  "#3D7983",
  "#308B79",
  "#229F6E",
  "#43856E",
  "#646B6E",
  "#85516E",
  "#A63570",
  "#6F6DA7",
  "#5C7EA7",
  "#498FA7",
  "#36A0A7",
  "#20B2AA",
  "#409497",
  "#607684",
  "#805871",
  "#A2395B",
  "#7F91C3",
  "#789AC4",
  "#71A3C5",
  "#6AACC6",
  "#60B6CA",
  "#7493A6",
  "#887082",
  "#9C4D5E",
  "#B22937",
  "#71A3C5",
  "#79A9CD",
  "#81AFD5",
  "#89B5DD",
  "#93BDE7",
  "#9E95B3",
  "#A96D7F",
  "#B4454B",
  "#C11C17",
  "#60B6CA",
  "#67ADC9",
  "#6EA4C8",
  "#759BC7",
  "#7F91C3",
  "#968193",
  "#AD7163",
  "#C46133",
  "#DE5003",
  "#20B2AA",
  "#33A1AA",
  "#4690AA",
  "#597FAA",
  "#6F6DA7",
  "#8B7085",
  "#A77363",
  "#C37641",
  "#E27A1D",
  "#229F6E",
  "#2F8D78",
  "#3C7B82",
  "#49698C",
  "#575597",
  "#7A6A78",
  "#9D7F59",
  "#C0943A",
  "#E6AA19",
  "#228B22",
  "#2A793B",
  "#326754",
  "#3A556D",
  "#434187",
  "#6E646A",
  "#99874D",
  "#C4AA30",
  "#EFCE10",
  "#4CA82B",
  "#41863B",
  "#36644B",
  "#2B425B",
  "#1F1D6D",
  "#4F4F58",
  "#808244",
  "#B0B42F",
  "#E0E61A",
  "#80C837",
  "#6FA044",
  "#5E7851",
  "#4D505E",
  "#3B256D",
  "#57515C",
  "#747E4C",
  "#90AA3B",
  "#ACD62A",
];
