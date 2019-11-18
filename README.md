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

## Interpretation and Goals

For the final project I want to continue on the experimentation on live aspects we used in the Cabinets of Curiosity project. By translating them to a new subject, namely global warming I think that we can build a tool that will help people understand the seriousness of the threat and the enormous difficulties that come with approaching it. There is a lot of potential to visualize the effect of global warming and how they relate to government spending using modern web-based graphing technologies.
My group plans to create a simulation of global average temperature in relation to government budgeting decisions. We will create central server to keep track of a vastly simplified “state of the world” in a predefined set of metrics; Global Average Temperature, Average Tax Percentage, measurement of personal Safety and average Cost of Living per household. Having any of these reach critical levels could lead to disastrous circumstances and will result in the simulation ending.
The simulation should give users the ability to visualize how decisions people in power make have direct effects on their wellbeing. We will attempt to achieve this by allowing the user to make adjustments to 5 major spending areas of the government; Climate Control Investment, Education, Welfare, Health and Military. Being fully aware that this set of metrics is an oversimplification we will be very honest about not aiming to be precise or create the illusion that the simulation will predict metrics accurately. Our goal should be to demonstrate the severe complexities that lie in the economics of a country and give people a chance to see and try out how their decisions might impact the metrics described above.
To get the simulation right, we make some initial assumptions about the current spending of a country based off of the United States 2019 budget [USASpending.gov] shown below in billions, and a newly imagined factor being the investment in climate control. Every second the current government spending (as set by the user) is used to calculate new values for the metrics, allowing the user to make continuous changes and immediately see their effect via charts and graphs.
climate: 0, welfare: 867, military: 500, health: 1300, education: 73
SOCL 3485 Writing Assignment II Jan Zimmermann
We make some assumptions about how changing the spending might affect the metrics when they are initialized to some sensible values yet to be determined. The mission of the simulation from then on is to keep the rise of global average temperature below +1.5°C which is the agreed upon goal in the Paris Climate Accord from which the United States recently decided to withdraw. For the simulation to make sense raising the total government spending above the initial values will cause the Tax metric to increase. Whereas the reduction in spending in Health will severely raise the average cost of living due to the increased burden put on the population. There will be many more such relationships with different significance factors that we will be working out. To start with, below are the initial values we plan on using for the 4 metrics we plan to track.
tax: 21%, global_temperature_delta: +0.0, cost_of_living: 700$, safety: 99%
Having the relationships between the metrics at sensible levels will require a lot of research and therefore our group plans on spending significant time on figuring out the exact numbers we will use to run the simulation.
Perusing the cabinet of curiosity project and now planning a simulation for the final project has been a great learning experience for me. Making the website for the midterm project was not only a lot of fun but also a new challenge I had never dealt with before. In general, the projects and presentations made me more aware of the mayor impact of topics discussed in class on our own community while also inspiring me to think about how I can use my skills in computer science in a variety of new disciplines.

## Learn more

- Official website: http://www.phoenixframework.org/
- Guides: https://hexdocs.pm/phoenix/overview.html
- Docs: https://hexdocs.pm/phoenix
- Mailing list: http://groups.google.com/group/phoenix-talk
- Source: https://github.com/phoenixframework/phoenix
