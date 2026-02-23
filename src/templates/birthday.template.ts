export function generateBirthdayHTML(name: string) {
  return `
    <html>
      <body>
      <div style="font-family: Arial; text-align:center; padding:40px; background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);">
        <h1>🎉 Happy Birthday ${name}! 🎉</h1>
        <p>Wishing you a wonderful year ahead.</p>
        <div>
      </body>
    </html>
  `;
}
