defmodule SimWeb.StateView do
  def render("state.json", %{state: state}) do
    state
  end
end
