const input = document.getElementById("inputText");
const paper = document.getElementById("paper");

/*
 저장
*/
input.value =
  localStorage.getItem("message_v4") || "";

input.addEventListener("input", () => {
  localStorage.setItem(
    "message_v4",
    input.value
  );
});

function renderDocument() {

  let text = fixText(
    input.value
  );

  let lines = text
    .split("\n");

  let html = "";

  let index = 0;

  /*
   메타
  */
  if (
    lines.length > 0 &&
    lines[0].trim().startsWith("[")
  ) {

    html += `
      <div class="meta">
        ${lines[0].trim()}
      </div>
    `;

    index++;
  }

  /*
   빈줄 제거
  */
  while (
    index < lines.length &&
    !lines[index].trim()
  ) {
    index++;
  }

  /*
   제목 수집
  */
  let titleLines = [];

  while (
    index < lines.length
  ) {

    const line =
      lines[index].trim();

    if (!line) {
      index++;
      break;
    }

    if (
      line.startsWith("본문") ||
      line.startsWith("서론") ||
      line.startsWith("본론") ||
      line.startsWith("결론")
    ) {
      break;
    }

    titleLines.push(line);

    index++;
  }

  html += `
    <div class="title">
      ${titleLines.join("<br>")}
    </div>
  `;

  /*
   본문
  */
  for (
    let i = index;
    i < lines.length;
    i++
  ) {

    let line =
      lines[i].trim();

    if (!line) continue;

    /*
     본문
    */
    if (
      line.startsWith("본문")
    ) {

      html += `
        <div class="section-title">
          본문
        </div>
      `;

      let content =
        line
          .replace(/^본문\s*[-–]?\s*/, "");

      if (content) {

        html += `
          <div class="body-text">
            ${content}
          </div>
        `;
      }

      continue;
    }

    /*
     서론
    */
    if (
      line.startsWith("서론")
    ) {

      html += `
        <div class="section-title">
          서론
        </div>
      `;

      let content =
        line
          .replace(/^서론\s*[-–]?\s*/, "");

      if (content) {

        html += `
          <div class="body-text">
            ${content}
          </div>
        `;
      }

      continue;
    }

    /*
     본론
    */
    if (
      line.startsWith("본론")
    ) {

      html += `
        <div class="section-title">
          본론
        </div>
      `;

      continue;
    }

    /*
     결론
    */
    if (
      line.startsWith("결론")
    ) {

      html += `
        <div class="section-title">
          결론
        </div>
      `;

      let content =
        line
          .replace(/^결론\s*[-–]?\s*/, "");

      if (content) {

        html += `
          <div class="body-text">
            ${content}
          </div>
        `;
      }

      continue;
    }

    /*
     대주제
    */
    if (
      isTopic(line)
    ) {

      html += `
        <div class="topic">
          ${line}
        </div>
      `;

      continue;
    }

    /*
     세부소주제
     (1)그리스도 (2)5가지확신
    */
    const detailMatches =
      line.match(/\(\d+\)/g);

    if (
      detailMatches &&
      detailMatches.length >= 2
    ) {

      html += `
        <div class="detail-line">
          ${normalizeDetailLine(line)}
        </div>
      `;

      continue;
    }

    /*
     소주제
     1) 확실한 복음
    */
    if (
      isSubtopic(line)
    ) {

      html += `
        <div class="subtopic">
          ${line}
        </div>
      `;

      continue;
    }

    /*
     일반본문
    */
    html += `
      <div class="body-text">
        ${line}
      </div>
    `;
  }

  paper.innerHTML = html;
}

/*
 PDF 저장
*/
function downloadPDF() {

  const title =
    document
      .querySelector(".title")
      ?.innerText
      ?.split("\n")[0]
      ?.trim()
    || "message";

  const opt = {
    margin: 0,
    filename: `${title}.pdf`,
    image: {
      type: "jpeg",
      quality: 1
    },
    html2canvas: {
      scale: 2
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait"
    }
  };

  html2pdf()
    .set(opt)
    .from(paper)
    .save();
}

/*
 최초 실행
*/
try {
  renderDocument();
}
catch (e) {
  console.error(e);
}
