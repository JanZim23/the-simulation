defmodule Sim.EventProvider do
  def get_events() do
    "events.json"
    |> File.read!()
    |> Jason.decode!()
    |> Enum.map(&Map.merge(%Sim.Event{}, &1))
    |> Enum.shuffle()
  end
end
