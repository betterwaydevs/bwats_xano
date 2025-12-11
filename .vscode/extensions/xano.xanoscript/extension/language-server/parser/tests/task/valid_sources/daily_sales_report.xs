task daily_sales_report {
  description = "Daily at 11 PM UTC generate a sales report by querying all payment transactions from the past 24 hours and calculating the total sales amount and transaction count. The task automatically executes every day starting from May 1, 2026, providing a summary of daily sales performance."
  stack {
    var $twenty_four_hours_ago {
      value = (now|to_timestamp|transform_timestamp:"24 hours ago":"UTC")
      description = "Calculate timestamp for 24 hours ago"
    }
  
    db.query payment_transactions {
      description = "Get all transactions from the past 24 hours"
      where = $db.payment_transactions.transaction_date >= $twenty_four_hours_ago
    } as $daily_sales
  
    var $transaction_count {
      value = $daily_sales|count
      description = "Count number of transactions"
    }
  
    var $total_sales {
      value = ($daily_sales[$$].amount)|sum
      description = "Initialize total sales amount"
    }
  
    var $report_date {
      value = now|to_timestamp
      description = "Current timestamp for the report"
    }
  
    db.transaction {
      description = "Store daily sales report with data consistency"
      stack {
        db.add reports {
          data = {
            report_type      : "daily_sales"
            report_date      : $report_date
            total_sales      : $total_sales
            transaction_count: $transaction_count
            period_start     : $twenty_four_hours_ago
            period_end       : $report_date
          }
        
          description = "Insert daily sales report into reports table"
        } as $report_result
      
        debug.log {
          value = "Daily sales report generated successfully"
          description = "Log successful report generation"
        }
      }
    }
  }

  schedule = [{starts_on: 2026-05-01 23:00:00+0000, freq: 86400}]

  history = "inherit"
}