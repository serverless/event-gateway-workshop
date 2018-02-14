const apiVersion = "v1";
const configUrl = "http://localhost:4001";

function getFunctions() {
  return fetch(`${configUrl}/${apiVersion}/functions`).then(resp =>
    resp.json().then(data => data.functions)
  );
}

function getSubscriptions() {
  return fetch(`${configUrl}/${apiVersion}/subscriptions`).then(resp =>
    resp.json().then(data => data.subscriptions)
  );
}

(() => {
  const funcsDiv = document.querySelector("#functions");
  const subsDiv = document.querySelector("#subscriptions");

  return Promise.all([getFunctions(), getSubscriptions()])
    .then(res => {
      const funcs = res[0];
      const subs = res[1];

      if (!funcs.length) {
        funcsDiv.innerHTML =
          "<p>There are functions registrations available right now</p>";
      } else {
        let table =
          '<table class="u-full-width"><thead><tr><th>Function ID</th></tr></thead></thead><tbody>#{items}</tbody></table>';
        const items = funcs.map(func => `<tr><td>${func.functionId}</td></tr>`);
        table = table.replace("#{items}", items.join(""));
        funcsDiv.innerHTML = table;
      }

      if (!subs.length) {
        subsDiv.innerHTML =
          "<p>There are no subscriptions available right now</p>";
      } else {
        let table =
          '<table class="u-full-width"><thead><tr><th>Function ID</th><th>Subscription ID</th></tr></thead></thead><tbody>#{items}</tbody></table>';
        const items = subs.map(
          sub =>
            `<tr><td>${sub.functionId}</td><td>${sub.subscriptionId}</td></tr>`
        );
        table = table.replace("#{items}", items.join(""));
        subsDiv.innerHTML = table;
      }
    })
    .catch(error => {
      alert(
        `Error pinging the Event Gateway config URL at "${configUrl}". Is the Event Gateway running?`
      );
    });
})();
