

async function main() {
  try {
    const res = await fetch('http://localhost:3000');
    const text = await res.text();
    const footerStart = text.indexOf('<footer');
    const footerEnd = text.indexOf('</footer>');
    if (footerStart !== -1 && footerEnd !== -1) {
      const footerHtml = text.substring(footerStart, footerEnd + 9);
      console.log('Isolated footer HTML length:', footerHtml.length);
      let pos = 0;
      while (true) {
        pos = footerHtml.indexOf('89517', pos);
        if (pos === -1) break;
        console.log('Footer Match:', footerHtml.substring(pos - 100, pos + 100));
        pos += 5;
      }
    }
  } catch (err) {
    console.error(err);
  }
}
main();
