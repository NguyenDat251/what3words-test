import { render, screen, fireEvent } from "@testing-library/react";
import Selection from "../Selection";
import "@testing-library/jest-dom/extend-expect"; // For additional matchers

// Mock the handleSelectOption function
const mockHandleSelectOption = jest.fn();

const options = [
  { id: 1, name: "Option 1" },
  { id: 2, name: "Option 2" },
];

const renderComponent = (props = {}) => {
  const defaultProps = {
    label: "Test Label",
    validateFn: jest.fn(() => ""), // Mock validate function
    selectedOption: null,
    handleSelectOption: mockHandleSelectOption,
    options,
    disabled: false,
    isFetchingOptions: false,
    ...props,
  };

  return render(<Selection {...defaultProps} />);
};

describe("Selection Component", () => {
  it("renders the label", () => {
    renderComponent();
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("renders the options", () => {
    renderComponent();
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  it("calls the handleSelectOption function when an option is clicked", () => {
    renderComponent();
    fireEvent.click(screen.getByText("Option 1"));
    expect(mockHandleSelectOption).toHaveBeenCalledWith(1);
  });

  it("disables the options when disabled prop is true", () => {
    renderComponent({ disabled: true });
    fireEvent.click(screen.getByText("Option 1"));
    expect(mockHandleSelectOption).not.toHaveBeenCalled();
  });

  it("displays the error message when the validateFn returns an error", () => {
    renderComponent({
      validateFn: jest.fn(() => "Test Error Message"),
    });
    expect(screen.getByText("Test Error Message")).toBeInTheDocument();
  });

  it("displays the loading message when isFetchingOptions is true", () => {
    renderComponent({ isFetchingOptions: true });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("option should has selected class when selectedOption is equal to option id", () => {
    renderComponent({ selectedOption: 1 });
    expect(screen.getByTestId("option-1")).toHaveClass("selected");
  });
});
