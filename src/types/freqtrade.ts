export interface FreqtradeTrade {
  trade_id: number;
  pair: string;
  base_currency?: string;
  quote_currency?: string;
  is_open: boolean;
  is_short?: boolean;
  exchange?: string;
  amount: number;
  stake_amount: number;
  strategy?: string;
  enter_tag?: string;
  timeframe?: number;
  open_date: string;
  open_timestamp?: number;
  open_rate: number;
  current_rate?: number;
  close_rate?: number;
  close_date?: string;
  close_profit?: number;
  close_profit_pct?: number;
  profit_ratio: number;
  profit_pct: number;
  profit_abs: number;
  profit_fiat?: number;
  stop_loss_abs: number;
  stop_loss_ratio?: number;
  stop_loss_pct?: number;
  initial_stop_loss_abs?: number;
  min_rate?: number;
  max_rate?: number;
  leverage?: number;
  stoploss_current_dist_pct?: number;
  exit_reason?: string;
  orders?: FreqtradeOrder[];
}

export interface FreqtradeOrder {
  pair: string;
  order_id: string;
  status: string;
  amount: number;
  safe_price: number;
  cost: number;
  filled: number;
  ft_order_side: string;
  order_type: string;
  is_open: boolean;
  order_timestamp: number;
}

export interface FreqtradeBalanceCurrency {
  currency: string;
  free: number;
  balance: number;
  used?: number;
  bot_owned?: number;
  est_stake?: number;
  stake?: string;
  is_position?: boolean;
}

export interface FreqtradeBalance {
  currencies: FreqtradeBalanceCurrency[];
  total: number;
  total_bot?: number;
  symbol: string;
  stake: string;
  note?: string;
  starting_capital?: number;
  starting_capital_pct?: number;
}

export interface FreqtradeProfit {
  profit_closed_coin: number;
  profit_closed_percent_mean?: number;
  profit_closed_fiat: number;
  profit_all_coin: number;
  profit_all_percent?: number;
  profit_all_fiat: number;
  trade_count: number;
  closed_trade_count: number;
  first_trade_date?: string;
  first_trade_humanized?: string;
  winning_trades: number;
  losing_trades: number;
  winrate: number;
  profit_factor?: number | null;
  best_pair?: string;
  max_drawdown?: number;
  max_drawdown_abs?: number;
  trading_volume?: number;
  bot_start_date?: string;
}

export interface FreqtradeDailyItem {
  date: string;
  abs_profit: number;
  rel_profit: number;
  starting_balance: number;
  fiat_value: number;
  trade_count: number;
}

export interface FreqtradeDailyResponse {
  data: FreqtradeDailyItem[];
  fiat_display_currency?: string;
  stake_currency?: string;
}

export interface FreqtradeTradesResponse {
  trades: FreqtradeTrade[];
  trades_count: number;
  total_trades: number;
}

export interface ConnectionConfig {
  serverUrl: string;
  username?: string;
  password?: string;
  useProxy: boolean;
  demoMode: boolean;
  pollInterval: number;
}
