defmodule Sim.Game.Messages do
  def broadcast(id, channel, event, message) do
    SimWeb.Endpoint.broadcast(channel <> ":" <> id, event, message)
  end

  def broadcast_event(id, channel, event) do
    broadcast(id, channel, "event", event)
  end

  def broadcast_tick(id, channel, state) do
    # TODO
    broadcast(id, channel, "tick", state |> Map.from_struct())
  end
end
