# Sim

## Planning

- Phases
  - Sign Up (Select Preferences)
  - Election (Maybe)
  - Term (Tick every second)
  - End (15 minutes)

Metrics

- Country Expenditures
- Climate Control
- Global Temperature
- Tax

Spending:

- Welfare
- Climate
- Health
- Military
- Education

## Simulation Principles

The simulation of global temperature rises will rely on data in the public domain and attempts to project
the global rise of temperature with some control over a countries expenditures.

Every second (About 1 week in real time) will cause the metrics to be updated according to the chosen spending. Spending can affect the metrics in predefined ways. The spending is initialized to the following: (Approximation found on [https://www.usaspending.gov/#/explorer/agency](https://www.usaspending.gov/#/explorer/agency))

```elixir
defstruct climate: 0,
            welfare: 867,
            military: 500,
            health: 1300,
            education: 73
```

The Metrics default to (found in various sources tbd):

```elixir
defstruct tax: 21,
          global_temp: 24.0,
          cost_of_living: 700,
          safety: 99,
          total_expenditures: 2740
```

The functions that are applied on every tick are determined by the following translation:

```elixir
  %{
    tax: {2740, 0.1, 21}, # For every dollar that the expenditure is over 2740 tax increases by 0.1 percent, starting at 21 %
    total_expenditures: {0.0, 1.0, 0},
    global_temp: [{:climate, 500, 0.0005}, {:education, 150, 0.0001}],
    safety: [{:military, 500, -0.07}, {:education, 70, -0.001}, {:welfare, 900, -0.003}],
    cost_of_living: [{:health, 1500, 0.10}, {:welfare, 700, 0.09}, {:education, 150, 0.08}]
  }
```

(Optional: Game Mode)
Players Types

- Citizen
- Senator
- President

Admin Controls:

- Start Game: Name
- close elections
- next action
- end game

Flow:

- Citizens have income (random) ((x/5 + 3)^7)/12 where 0 < x < 10

- The president changes the spending

- the spending determines the deltas

- the detlas are applied to the metric every 10 second

- the metrics trigger events (every minute)

- events effect metrics (this is where stuff gets interesting)

- citizens are affected by metrics.

- when (income - %taxes) - cost of living is below 0. Players loose.

To start your Phoenix server:

- Install dependencies with `mix deps.get`
- Install Node.js dependencies with `cd assets && npm install`
- Start Phoenix endpoint with `mix phx.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

Ready to run in production? Please [check our deployment guides](https://hexdocs.pm/phoenix/deployment.html).

## Learn more

- Official website: http://www.phoenixframework.org/
- Guides: https://hexdocs.pm/phoenix/overview.html
- Docs: https://hexdocs.pm/phoenix
- Mailing list: http://groups.google.com/group/phoenix-talk
- Source: https://github.com/phoenixframework/phoenix
