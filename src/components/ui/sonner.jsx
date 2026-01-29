import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"


const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]
          description: "group-[.toast]
          actionButton:
            "group-[.toast]
          cancelButton:
            "group-[.toast]
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
