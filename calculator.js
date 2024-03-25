function calculateScenario(initialBalance, managementFee, monthlyGrow, taxThreshold, nYears) {
    const monthlyFee = managementFee / 12;

    const totalFeeTaken = [0];
    let currentBalance = initialBalance;
    const tax = [(currentBalance - taxThreshold) * 0.25];
    const balances = [currentBalance];
    const months = [0];

    for (let year = 0; year < nYears; year++) {
        for (let month = 0; month < 12; month++) {
            currentBalance *= monthlyGrow;
            const feeTaken = currentBalance * monthlyFee;
            currentBalance -= feeTaken;
            totalFeeTaken.push(totalFeeTaken[totalFeeTaken.length - 1] + feeTaken);
            tax.push((currentBalance - taxThreshold) * 0.25);
            months.push(months[months.length - 1] + 1);
            balances.push(currentBalance);
        }
    }

    const price = tax.map((value, index) => value + totalFeeTaken[index]);

    return {
        balances: balances,
        price: price,
        totalFeeTaken: totalFeeTaken,
        tax: tax,
        months: months
    };
}

function calculate_tax_difference(initialBalance1, taxThreshold1, managementFee1, managementFee2, yearlyGrow, nYears) {
    // Scenario 1
    const monthlyGrow = Math.pow(1 + yearlyGrow / 100, 1 / 12);
    const { balances: balances1, price: price1 } = calculateScenario(initialBalance1, managementFee1 / 100, monthlyGrow, taxThreshold1, nYears);

    // Scenario 2
    const initialBalance2 = initialBalance1 - (initialBalance1 - taxThreshold1) * 0.25;
    const taxThreshold2 = initialBalance2;
    const { balances: balances2, price: price2 } = calculateScenario(initialBalance2, managementFee2 / 100, monthlyGrow, taxThreshold2, nYears);

    // Calculate tax delay
    const taxDelay = balances2.map((b2, index) => (b2 - price2[index]) - (balances1[index] - price1[index]));

    const finalDifference = taxDelay[taxDelay.length - 1];

    return finalDifference;
}

function calculateDifference() {
    const initialBalance = parseFloat(document.getElementById('initialBalance').value);
    const taxThreshold = parseFloat(document.getElementById('taxThreshold').value);
    const managementFee1 = parseFloat(document.getElementById('managementFee1').value);
    const managementFee2 = parseFloat(document.getElementById('managementFee2').value);
    const monthlyGrow = parseFloat(document.getElementById('monthlyGrow').value);
    const nYears = parseInt(document.getElementById('nYears').value);

    // Call your existing function or include the calculation logic here
    const result = calculate_tax_difference(initialBalance, taxThreshold, managementFee1, managementFee2, monthlyGrow, nYears);

    // Display the result
    document.getElementById('result').textContent = `קרן 2 תהיה גדולה ב: ${result.toFixed(2)} מקרן 1`;
}
