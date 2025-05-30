const db = require('../config/database');

// Cash-in operation
exports.cashIn = (req, res) => {
  const { RFID, amount } = req.body;

  // Input validation
  if (!RFID || !amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: 'Invalid RFID or amount' });
  }

  db.beginTransaction(err => {
    if (err) {
      console.error('Error starting transaction:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    // First check if passenger exists
    const checkQuery = 'SELECT * FROM Passenger WHERE RFID = ?';
    db.query(checkQuery, [RFID], (err, results) => {
      if (err) {
        console.error('Error checking passenger:', err);
        db.rollback();
        return res.status(500).json({ message: 'Database error' });
      }

      if (results.length === 0) {
        db.rollback();
        return res.status(404).json({ message: 'Passenger not found' });
      }

      // Update passenger balance
      const updateQuery = 'UPDATE Passenger SET CurrentBalance = CurrentBalance + ? WHERE RFID = ?';
      db.query(updateQuery, [amount, RFID], (err, result) => {
        if (err) {
          console.error('Error updating balance:', err);
          db.rollback();
          return res.status(500).json({ message: 'Database error' });
        }

        // Record the transaction
        const transactionQuery = 'INSERT INTO Transactions (RFID, TransactionType, Amount, RemainingBalance) VALUES (?, ?, ?, (SELECT CurrentBalance FROM Passenger WHERE RFID = ?))';
        db.query(transactionQuery, [RFID, 'Cash-in', amount, RFID], (err, result) => {
          if (err) {
            console.error('Error recording transaction:', err);
            db.rollback();
            return res.status(500).json({ message: 'Database error' });
          }

          db.commit(err => {
            if (err) {
              console.error('Error committing transaction:', err);
              db.rollback();
              return res.status(500).json({ message: 'Database error' });
            }
            res.status(200).json({ message: 'Cash-in successful' });
          });
        });
      });
    });
  });
};

// Process travel payment
exports.processTravel = (req, res) => {
  const { RFID, destination, fare } = req.body;

  // Input validation
  if (!RFID || !destination || !fare || isNaN(fare) || fare <= 0) {
    return res.status(400).json({ message: 'Invalid RFID, destination, or fare' });
  }

  db.beginTransaction(err => {
    if (err) {
      console.error('Error starting transaction:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    // First check if passenger exists and has sufficient balance
    const checkQuery = 'SELECT * FROM Passenger WHERE RFID = ? AND CurrentBalance >= ?';
    db.query(checkQuery, [RFID, fare], (err, results) => {
      if (err) {
        console.error('Error checking passenger:', err);
        db.rollback();
        return res.status(500).json({ message: 'Database error' });
      }

      if (results.length === 0) {
        db.rollback();
        return res.status(400).json({ message: 'Insufficient balance or invalid RFID' });
      }

      // Update passenger balance
      const updateQuery = 'UPDATE Passenger SET CurrentBalance = CurrentBalance - ? WHERE RFID = ?';
      db.query(updateQuery, [fare, RFID], (err, result) => {
        if (err) {
          console.error('Error updating balance:', err);
          db.rollback();
          return res.status(500).json({ message: 'Database error' });
        }

        // Record the transaction
        const transactionQuery = 'INSERT INTO Transactions (RFID, TransactionType, Amount, Destination, Fare, RemainingBalance) VALUES (?, ?, ?, ?, ?, (SELECT CurrentBalance FROM Passenger WHERE RFID = ?))';
        db.query(transactionQuery, [RFID, 'Payment', fare, destination, fare, RFID], (err, result) => {
          if (err) {
            console.error('Error recording transaction:', err);
            db.rollback();
            return res.status(500).json({ message: 'Database error' });
          }

          db.commit(err => {
            if (err) {
              console.error('Error committing transaction:', err);
              db.rollback();
              return res.status(500).json({ message: 'Database error' });
            }
            res.status(200).json({ message: 'Travel payment processed successfully' });
          });
        });
      });
    });
  });
};

// Get all transactions
exports.getTransactions = (req, res) => {
  const query = 'SELECT * FROM Transactions ORDER BY Timestamp DESC';
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
};

// Delete a transaction
exports.deleteTransaction = (req, res) => {
  const { id } = req.params;

  // First get the transaction details
  const getTransactionQuery = 'SELECT * FROM Transactions WHERE TransactionID = ?';
  db.query(getTransactionQuery, [id], (err, transactions) => {
    if (err) {
      console.error('Error fetching transaction:', err);
      return res.status(500).json({ message: 'Failed to delete transaction' });
    }
    
    if (transactions.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const transaction = transactions[0];

    // If it's a cash-in transaction, update the passenger's balance
    if (transaction.TransactionType === 'Cash-in') {
      const updateBalanceQuery = 'UPDATE Passenger SET CurrentBalance = CurrentBalance - ? WHERE RFID = ?';
      db.query(updateBalanceQuery, [transaction.Amount, transaction.RFID], (err, result) => {
        if (err) {
          console.error('Error updating balance:', err);
          return res.status(500).json({ message: 'Failed to update balance' });
        }

        // After updating balance, delete the transaction
        const deleteQuery = 'DELETE FROM Transactions WHERE TransactionID = ?';
        db.query(deleteQuery, [id], (err, result) => {
          if (err) {
            console.error('Error deleting transaction:', err);
            return res.status(500).json({ message: 'Failed to delete transaction' });
          }
          res.status(200).json({ message: 'Transaction deleted and balance updated successfully' });
        });
      });
    } else {
      // If it's not a cash-in transaction, just delete it
      const deleteQuery = 'DELETE FROM Transactions WHERE TransactionID = ?';
      db.query(deleteQuery, [id], (err, result) => {
        if (err) {
          console.error('Error deleting transaction:', err);
          return res.status(500).json({ message: 'Failed to delete transaction' });
        }
        res.status(200).json({ message: 'Transaction deleted successfully' });
      });
    }
  });
};
