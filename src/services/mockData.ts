import {
  FreqtradeTrade,
  FreqtradeBalance,
  FreqtradeProfit,
  FreqtradeDailyResponse,
  FreqtradeTradesResponse
} from '../types/freqtrade';

export const mockOpenTrades: FreqtradeTrade[] = [
  {
    trade_id: 1,
    pair: "ETH/EUR",
    base_currency: "ETH",
    quote_currency: "EUR",
    is_open: true,
    is_short: false,
    exchange: "okx",
    amount: 0.026362,
    stake_amount: 57.83,
    strategy: "BreakoutMomentumSpot",
    enter_tag: "EMA_Cross_Bull",
    leverage: 1,
    open_date: "2026-09-11 19:07:52",
    open_rate: 2193.57,
    current_rate: 2212.40,
    profit_ratio: 0.008584,
    profit_pct: 0.86,
    profit_abs: 0.50,
    profit_fiat: 0.50,
    stop_loss_abs: 1754.95,
    stop_loss_pct: -20.0,
    min_rate: 2161.11,
    max_rate: 2215.80,
    orders: [
      {
        pair: "ETH/EUR",
        order_id: "3914167200845041664",
        status: "closed",
        amount: 0.026362,
        safe_price: 2193.57,
        cost: 57.83,
        filled: 0.026362,
        ft_order_side: "buy",
        order_type: "limit",
        is_open: false,
        order_timestamp: 1789153672798
      }
    ]
  },
  {
    trade_id: 2,
    pair: "SOL/EUR",
    base_currency: "SOL",
    quote_currency: "EUR",
    is_open: true,
    is_short: false,
    exchange: "okx",
    amount: 0.452,
    stake_amount: 60.00,
    strategy: "TrendRiderPro",
    enter_tag: "RSI_Oversold_Rebound",
    leverage: 1,
    open_date: "2026-09-12 08:30:14",
    open_rate: 132.74,
    current_rate: 135.92,
    profit_ratio: 0.023956,
    profit_pct: 2.40,
    profit_abs: 1.44,
    profit_fiat: 1.44,
    stop_loss_abs: 122.12,
    stop_loss_pct: -8.0,
    min_rate: 131.90,
    max_rate: 136.20
  }
];

export const mockBalance: FreqtradeBalance = {
  currencies: [
    {
      currency: "EUR",
      free: 42.50,
      balance: 42.50,
      stake: "EUR"
    },
    {
      currency: "ETH",
      free: 0.026362,
      balance: 0.026362,
      est_stake: 58.33,
      stake: "EUR"
    },
    {
      currency: "SOL",
      free: 0.452,
      balance: 0.452,
      est_stake: 61.44,
      stake: "EUR"
    }
  ],
  total: 162.27,
  total_bot: 162.27,
  symbol: "EUR",
  stake: "EUR",
  starting_capital: 150.00,
  starting_capital_pct: 8.18
};

export const mockProfit: FreqtradeProfit = {
  profit_closed_coin: 10.33,
  profit_closed_fiat: 10.33,
  profit_all_coin: 12.27,
  profit_all_fiat: 12.27,
  profit_all_percent: 8.18,
  trade_count: 14,
  closed_trade_count: 12,
  winning_trades: 9,
  losing_trades: 3,
  winrate: 0.75,
  profit_factor: 2.84,
  best_pair: "SOL/EUR",
  max_drawdown: 0.024,
  trading_volume: 1240.50,
  bot_start_date: "2026-08-15 10:00:00"
};

// Generate 30 days of realistic trending sparkline data
export const mockDaily: FreqtradeDailyResponse = {
  stake_currency: "EUR",
  fiat_display_currency: "EUR",
  data: [
    { date: "2026-08-14", abs_profit: 0.0, rel_profit: 0.0, starting_balance: 150.0, fiat_value: 150.0, trade_count: 0 },
    { date: "2026-08-16", abs_profit: 0.8, rel_profit: 0.0053, starting_balance: 150.0, fiat_value: 150.8, trade_count: 1 },
    { date: "2026-08-18", abs_profit: 1.4, rel_profit: 0.0093, starting_balance: 150.8, fiat_value: 152.2, trade_count: 1 },
    { date: "2026-08-20", abs_profit: -0.6, rel_profit: -0.0039, starting_balance: 152.2, fiat_value: 151.6, trade_count: 1 },
    { date: "2026-08-22", abs_profit: 1.9, rel_profit: 0.0125, starting_balance: 151.6, fiat_value: 153.5, trade_count: 2 },
    { date: "2026-08-25", abs_profit: 2.1, rel_profit: 0.0136, starting_balance: 153.5, fiat_value: 155.6, trade_count: 2 },
    { date: "2026-08-28", abs_profit: 0.5, rel_profit: 0.0032, starting_balance: 155.6, fiat_value: 156.1, trade_count: 1 },
    { date: "2026-08-31", abs_profit: -1.2, rel_profit: -0.0076, starting_balance: 156.1, fiat_value: 154.9, trade_count: 1 },
    { date: "2026-09-03", abs_profit: 2.8, rel_profit: 0.0180, starting_balance: 154.9, fiat_value: 157.7, trade_count: 2 },
    { date: "2026-09-06", abs_profit: 1.5, rel_profit: 0.0095, starting_balance: 157.7, fiat_value: 159.2, trade_count: 1 },
    { date: "2026-09-09", abs_profit: 1.1, rel_profit: 0.0069, starting_balance: 159.2, fiat_value: 160.3, trade_count: 1 },
    { date: "2026-09-11", abs_profit: 0.9, rel_profit: 0.0056, starting_balance: 160.3, fiat_value: 161.2, trade_count: 1 },
    { date: "2026-09-12", abs_profit: 1.07, rel_profit: 0.0066, starting_balance: 161.2, fiat_value: 162.27, trade_count: 1 }
  ]
};

export const mockClosedTrades: FreqtradeTradesResponse = {
  trades_count: 3,
  total_trades: 12,
  trades: [
    {
      trade_id: 12,
      pair: "BTC/EUR",
      amount: 0.0015,
      open_rate: 54100.0,
      close_rate: 55600.0,
      close_profit: 2.25,
      close_profit_pct: 2.77,
      profit_ratio: 0.0277,
      profit_pct: 2.77,
      profit_abs: 2.25,
      stop_loss_abs: 52000.0,
      open_date: "2026-09-09 14:15:00",
      close_date: "2026-09-10 18:40:12",
      exit_reason: "roi",
      is_open: false,
      stake_amount: 81.15
    },
    {
      trade_id: 11,
      pair: "SOL/EUR",
      amount: 0.55,
      open_rate: 128.40,
      close_rate: 134.20,
      close_profit: 3.19,
      close_profit_pct: 4.51,
      profit_ratio: 0.0451,
      profit_pct: 4.51,
      profit_abs: 3.19,
      stop_loss_abs: 120.00,
      open_date: "2026-09-07 09:20:00",
      close_date: "2026-09-08 11:05:30",
      exit_reason: "trailing_stop_loss",
      is_open: false,
      stake_amount: 70.62
    },
    {
      trade_id: 10,
      pair: "AVAX/EUR",
      amount: 2.4,
      open_rate: 26.50,
      close_rate: 25.70,
      close_profit: -1.92,
      close_profit_pct: -3.01,
      profit_ratio: -0.0301,
      profit_pct: -3.01,
      profit_abs: -1.92,
      stop_loss_abs: 25.50,
      open_date: "2026-09-05 20:00:00",
      close_date: "2026-09-06 04:32:00",
      exit_reason: "stop_loss",
      is_open: false,
      stake_amount: 63.60
    }
  ]
};
